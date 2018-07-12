import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import { getSelectedRecordsAsObject } from './select'
import { getScatterPlotDataByCategory,
  getMainPlotData,
  getScatterPlotData
} from './plotData';
import { getRawDataForFieldId, getDetailsForFieldId, getBinsForFieldId, getAllActiveFields } from './field'
import { getMainPlot } from './plot';
import { getSelectedDatasetMeta } from './dataset';
import { getFilteredList } from './filter';
import { getFilteredDataForFieldId } from './preview';
import { getZReducer, getZScale, zReducers, getCircumferenceScale, getRadiusScale, getSnailOrigin } from './plotParameters';
import { getColorPalette } from './color';
import immutableUpdate from 'immutable-update';
import { scaleLinear as d3scaleLinear } from 'd3-scale';
import { scaleSqrt as d3scaleSqrt } from 'd3-scale';
import { scaleLog as d3scaleLog } from 'd3-scale';
import { line as d3Line } from 'd3-shape';
import { radialLine as d3RadialLine } from 'd3-shape';
import { arc as d3Arc } from 'd3-shape';
import { format as d3Format } from 'd3-format'
import { default as Simplify } from 'simplify-js'
import { getIdentifiersForList } from './list'
import { format as d3format} from 'd3-format'

export const getSelectedScatterPlotDataByCategory = createSelector(
  getMainPlotData,
  getScatterPlotData,
  getSelectedRecordsAsObject,
  (state) => getMainPlot(state).axes.z,
  (state) => getBinsForFieldId(state,getMainPlot(state).axes.cat),
  (plotData,scatterData,selected,zAxis,bins) => {
    let byCat = [];
    let selByCat = [];
    let selAll = [];
    let catKeys = {}
    if (plotData.axes.x.values.length == 0 ||
        plotData.axes.y.values.length == 0 ||
        plotData.axes.z.values.length == 0 ||
        plotData.axes.cat.values.length == 0){
      return {data:[]}
    }
    bins.forEach((bin,i)=>{
      byCat[i] = []
      selByCat[i] = []
      bin.keys.forEach(key=>{
        catKeys[key] = i
      })
    })
    let cats = plotData.axes.cat
    let zs = plotData.axes.z
    let len = zs.values.length
    for (let i = 0; i < len; i++){
      byCat[catKeys[cats.values[i]]].push(
        zs.values[i]
      )
      if (selected[scatterData.data[i].id]){
        selByCat[catKeys[cats.values[i]]].push(
          zs.values[i]
        )
        selAll.push(zs.values[i])
      }
    }
    return {byCat,selByCat,selAll,zAxis,bins,catKeys};
  }
)

export const getSummary = createSelector(
  getScatterPlotData,
  getSelectedScatterPlotDataByCategory,
  getZReducer,
  getColorPalette,
  (state) => getRawDataForFieldId(state,getMainPlot(state).axes.cat),
  (all,selected,reducer,palette,raw) => {
    let bins = selected.bins
    let zAxis = selected.zAxis
    let values = {counts:{},reduced:{},n50:{}}
    values.reduced.all = reducer.func(all.data.map(d=>d.z))
    values.reduced.sel = selected.selAll ? reducer.func(selected.selAll) : 0
    if (zAxis == 'length'){
      values.n50.all = zReducers.n50(all.data.map(d=>d.z))
      values.n50.sel = selected.selAll ? zReducers.n50(selected.selAll) : 0
      values.n50.binned = []
      values.n50.selBinned = []
    }
    values.counts.all = all.data.length
    values.counts.sel = selected.selAll ? selected.selAll.length : 0
    values.reduced.binned = []
    values.reduced.selBinned = []
    values.counts.binned = []
    values.counts.selBinned = []
    let other = []
    if (bins){
      bins.forEach((bin,i) => {
        values.reduced.binned[i] = reducer.func(selected.byCat[i])
        values.reduced.selBinned[i] = selected.selAll ? reducer.func(selected.selByCat[i]) : 0
        if (zAxis == 'length'){
          values.n50.binned[i] = zReducers.n50(selected.byCat[i])
          values.n50.selBinned[i] = selected.selAll ? zReducers.n50(selected.selByCat[i]) : 0
        }
        values.counts.binned[i] = selected.byCat[i].length
        values.counts.selBinned[i] = selected.selAll ? selected.selByCat[i].length : 0
      })
      if (bins[9] && bins[9].id == 'other'){
        bins[9].keys.forEach((index) => {
          other.push(raw.keys[index])
        })
        other = other.sort((a,b)=>{
          if(a < b) return -1
          if(a > b) return 1
          return 0
        })
      }
    }
    return { values,zAxis,bins,palette,other,reducer:reducer.id }
  }
)

export const getCumulative = createSelector(
  getScatterPlotData,
  getSelectedScatterPlotDataByCategory,
  (all,selected) => {
    let zAxis = selected.zAxis
    let bins = selected.bins
    let values = {all:[],byCat:[]}
    let arr = all.data.map(d=>d.z)
    arr.sort((a,b)=>b-a)
    let tot = 0
    arr.forEach((z,i)=>{arr[i] += tot; tot += z})
    values.all = arr
    if (bins){
      bins.forEach((bin,i) => {
        let arr = selected.byCat[i].slice()
        arr.sort((a,b)=>b-a)
        let tot = 0
        arr.forEach((z,i)=>{arr[i] += tot; tot += z})
        values.byCat.push(arr)
      })
    }
    return { values,zAxis }
  }
)

export const cumulativeCurves = createSelector(
  getCumulative,
  getColorPalette,
  (cumulative,palette) => {
    let values = cumulative.values
    let all = values.all
    let byCat = values.byCat
    let zAxis = cumulative.zAxis
    let xScale = d3scaleLinear().range([50,950]).domain([0,all.length])
    let yScale = d3scaleLinear().range([950,50]).domain([0,all[all.length - 1]])
    let f = d3Format(".3f");
    let line = d3Line().x(d=>f(d.x)).y(d=>f(d.y))
    let xyScale = arr => [0].concat(arr).map((y,x)=>({x:xScale(x),y:yScale(y)}))
    let paths = {all:'',scaled:[],byCat:[],offsets:[],count_offsets:[]}
    // values.all = Simplify(scaled)
    let counts = byCat.map((arr,i)=>({i,l:arr.length}))
    let spans = byCat.map((arr,i)=>({i,l:arr[arr.length-1]}))
    let offset = {x:0,y:0}
    paths.scaled = byCat.map(arr=>xyScale(arr))
    spans.sort((a,b)=>b.l-a.l).forEach(o=>{
      paths.offsets[o.i] = {...offset}
      let scaled = paths.scaled[o.i]
      offset.x += scaled[scaled.length-1].x - 50
      offset.y += 950 - scaled[scaled.length-1].y
      paths.byCat[o.i] = line(Simplify(scaled,0.5))
    })
    offset = {x:0,y:0}
    counts.sort((a,b)=>b.l-a.l).forEach(o=>{
      paths.count_offsets[o.i] = {...offset}
      let scaled = paths.scaled[o.i]
      offset.x += scaled[scaled.length-1].x - 50
      offset.y += 950 - scaled[scaled.length-1].y
    })
    paths.all = line(Simplify(xyScale(all),0.5))
    // byCat.forEach((arr,i)=>{
    //   paths.byCat[i] = line(Simplify(xyScale(arr),0.5))
    // })
    return { values,paths,zAxis,palette }
  }
)

const mean = arr => arr.reduce((a,b) => a + b, 0) / arr.length

export const getCircular = createSelector(
  (state) => getFilteredDataForFieldId(state,'gc'),
  (state) => getFilteredDataForFieldId(state,'length'),
  (state) => getFilteredDataForFieldId(state,'ncount'),
  (gc,length,ncount) => {
    let values = {nXlen:[],nXnum:[],gc:[],sum:[],n:[]}
    let xAxis = 'gc'
    let zAxis = 'length'
    let arr = []
    gc.values.forEach((x,i)=>{
      arr[i] = {x,z:length.values[i],n:ncount.values[i] ? ncount.values[i]/length.values[i] : 0}
    })
    arr.sort((a,b)=>b.z-a.z)
    let sum = arr.reduce((a, x, i) => [...a, x.z + (a[i-1] || 0)], [])
    let tot = sum[sum.length-1]
    values.nXlen = []
    let i = 0
    for (let x = 1; x <= 1000; x++){
      let l = Math.ceil(tot * x / 1000)
      let gc = [arr[i].x]
      let n = [arr[i].n]
      while (sum[i] < l){
        i++
        gc.push(arr[i].x)
        n.push(arr[i].n)
      }
      values.sum[x-1] = sum[i]
      values.nXlen[x-1] = arr[i].z
      values.nXnum[x-1] = i+1
      values.gc[x-1] = {gc,min:Math.min(...gc),max:Math.max(...gc),mean:mean(gc)}
      values.n[x-1] = {n,min:Math.min(...n),max:Math.max(...n),mean:mean(n)}
    }
    let meanN = mean(values.n.map(o=>o.mean))
    let meanGC = mean(values.gc.map(o=>o.mean))
    let composition = {gc:meanGC,at:1-meanGC,n:meanN}
    values.all = arr
    return { values,composition,xAxis,zAxis }
  }
)

export const circularCurves = createSelector(
  getCircular,
  getColorPalette,
  getCircumferenceScale,
  getRadiusScale,
  getSnailOrigin,
  (circular,palette,circumference,radius,origin) => {
    let invert = origin == 'center'
    let values = circular.values
    let composition = circular.composition
    let gc = values.gc
    let ns = values.n
    let nXlen = values.nXlen
    let nXnum = values.nXnum
    let sum = values.sum
    let rRange = [350,0]
    let lRange = [0,250]
    if (invert){
      rRange = [0,350]
      lRange = [350,100]
    }
    circumference = Math.max(circumference,sum[999])
    let maxAngle = 2*Math.PI*sum[999]/circumference
    let all = values.all
    let max = all[0].z
    radius = Math.max(radius,max)
    let min = 0
    let cScale = d3scaleLinear().range([0,maxAngle]).domain([0,999])
    let rScale = d3scaleSqrt().range(rRange).domain([min,radius])
    let lScale = d3scaleLog().range(lRange).domain([1,10000000])
    let oScale = d3scaleLinear().range([350,425]).domain([0,1])
    let f = d3Format(".3f");
    let si = d3Format(".2s");
    let paths = {}
    let pathProps = {}
    paths.nXnum = d3RadialLine()(
      [[cScale(0),lScale(nXnum[nXnum.length-1])]]
      .concat(
        nXnum.map((n,i)=>[cScale(i),lScale(n)])
      ).concat(nXnum.map((n,i)=>[cScale(999-i),lScale(1)]))
    )
    pathProps.nXnum = {
      fill:palette.colors[8],
      stroke:palette.colors[8]
    }
    for (let count = 10; count < 10000000; count *=10){
      paths['nXnumTick_'+count] = d3RadialLine()(
        nXnum.map((n,i)=>[cScale(i),lScale(count)])
      )
      pathProps['nXnumTick_'+count] = {fill:'none',stroke:'#ffffff',strokeWidth:3}
    }
    paths.nXlen = d3RadialLine()(
      [[cScale(0),rScale(min)]]
      .concat(
        nXlen.map((n,i)=>[cScale(i),rScale(n)])
      )
      .concat(nXlen.map((n,i)=>[cScale(999-i),rScale(min)]))
    )
    pathProps.nXlen = {fill:'#999999',stroke:'#999999'}
    paths.longest = d3Arc()({
      startAngle: cScale(0),
      endAngle: cScale(Math.floor(1000 * all[0].z / sum[999])),
      innerRadius: rScale(max),
      outerRadius: rScale(min)
    })
    pathProps.longest = {fill:palette.colors[5],stroke:'none'}
    paths.n50 = d3Arc()({
      startAngle: cScale(0),
      endAngle: cScale(499),
      innerRadius: rScale(nXlen[499]),
      outerRadius: rScale(min)
    })
    pathProps.n50 = {fill:palette.colors[7],stroke:palette.colors[7]}
    paths.n90 = d3Arc()({
      startAngle: cScale(0),
      endAngle: cScale(899),
      innerRadius: rScale(nXlen[899]),
      outerRadius: rScale(min)
    })
    pathProps.n90 = {fill:palette.colors[6],stroke:'none'}
    paths.n50stroke = paths.n50
    pathProps.n50stroke = {fill:'none',stroke:palette.colors[7],strokeWidth:3}
    paths.longestStroke = paths.longest
    pathProps.longestStroke = {fill:'none',stroke:palette.colors[5],strokeWidth:3}
    paths.meanAT = d3RadialLine()(
      [[cScale(0),oScale(1)]]
      .concat(
        gc.map((n,i)=>[cScale(i),oScale(n.mean)])
      )
      .concat(gc.map((n,i)=>[cScale(999-i),oScale(1-ns[999-i].mean/2)]))
    )
    pathProps.meanAT = {fill:palette.colors[0],stroke:'none'}
    paths.meanGC = d3RadialLine()(
      [[cScale(0),oScale(0)]]
      .concat(
        gc.map((n,i)=>[cScale(i),oScale(n.mean)])
      )
      .concat(gc.map((n,i)=>[cScale(999-i),oScale(0+ns[999-i].mean/2)]))
    )
    pathProps.meanGC = {fill:palette.colors[1],stroke:'none'}
    // paths.maxNupper = d3RadialLine()(ns.map((n,i)=>[cScale(i),oScale(n.max/2)]))
    // pathProps.maxNupper = {fill:'none',stroke:'rgba(255,255,255,0.9)',strokeWidth:1}
    paths.maxNlower = d3RadialLine()(
      [[cScale(0),oScale(1)]]
      .concat(ns.map((n,i)=>[cScale(i),oScale(1-n.max/2)]))
      .concat(ns.map((n,i)=>[cScale(999-i),oScale(1)]))
    )
    pathProps.maxNlower = {fill:'rgba(255,255,255,0.2)',stroke:'rgba(255,255,255,0.4)',strokeWidth:0.5}
    paths.maxNupper = d3RadialLine()(
      [[cScale(0),oScale(0)]]
      .concat(ns.map((n,i)=>[cScale(i),oScale(n.max/2)]))
      .concat(ns.map((n,i)=>[cScale(999-i),oScale(0)]))
    )
    pathProps.maxNupper = {fill:'rgba(255,255,255,0.2)',stroke:'rgba(255,255,255,0.4)',strokeWidth:0.5}
    paths.maxGC = d3RadialLine()(
      [[cScale(0),oScale(1)]]
      .concat(gc.map((n,i)=>[cScale(i),oScale(n.max)]))
      .concat(gc.map((n,i)=>[cScale(999-i),oScale(gc[999-i].mean)]))
    )
    let stroke1 = palette.colors[1].replace('rgb','rgba').replace(')',',0.6)')
    let fill1 = palette.colors[1].replace('rgb','rgba').replace(')',',0.4)')
    pathProps.maxGC = {fill:fill1,stroke:stroke1,strokeWidth:1}
    paths.minGC = d3RadialLine()(
      [[cScale(0),oScale(0)]]
      .concat(gc.map((n,i)=>[cScale(i),oScale(n.min)]))
      .concat(gc.map((n,i)=>[cScale(999-i),oScale(gc[999-i].mean)]))
    )
    let stroke0 = palette.colors[0].replace('rgb','rgba').replace(')',',0.6)')
    let fill0 = palette.colors[0].replace('rgb','rgba').replace(')',',0.4)')
    pathProps.minGC = {fill:fill0,stroke:stroke0,strokeWidth:1}
    paths.meanGCstroke = d3RadialLine()(
      gc.map((n,i)=>[cScale(i),oScale(n.mean)])
    )
    pathProps.meanGCstroke = {fill:'none',stroke:palette.colors[1],strokeWidth:1}

    paths.startGC = d3RadialLine()([
      [cScale(0),oScale(0)],
      [cScale(0),oScale(1)]
    ])
    pathProps.startGC = {fill:'none',stroke:'#cccccc',strokeWidth:2}

    let axes = {inner:{},outer:{},radial:{},end_radial:{}}
    axes.inner.path = d3RadialLine()(
      gc.map((n,i)=>[cScale(i),oScale(0)])
    )
    axes.inner.ticks = {major:[],minor:[],labels:[]}
    axes.outer.ticks = {major:[],minor:[],labels:[]}
    for (let a = 0; a < 1000; a += 20){
      if (a % 100 == 0){
        let pct = Math.floor(a/10)
        if (pct == 0) pct += '%'
        axes.inner.ticks.major.push(
          d3RadialLine()([
            [cScale(a),oScale(0)],
            [cScale(a),oScale(0.25)]
          ])
        )
        axes.outer.ticks.major.push(
          d3RadialLine()([
            [cScale(a),oScale(1)],
            [cScale(a),oScale(0.75)]
          ])
        )
        axes.inner.ticks.labels.push(
          {
            path: d3RadialLine()([
              [cScale(a-10),oScale(0.4)],
              [cScale(a+10),oScale(0.4)]
            ]),
            text: pct
          }
        )
        let b = a > 0 ? a : 1000
        axes.outer.ticks.labels.push(
          {
            path: d3RadialLine()(
              ([...Array(35).keys()]).map(i=>(
                [cScale(b+i-34),oScale(1.05)],
                [cScale(b+i-34),oScale(1.05)]
              ))
            ),
            text: si(sum[b-1]),
            fontSize: '1em',
            align:'right'
          }
        )

      }
      else {
        axes.inner.ticks.minor.push(
          d3RadialLine()([
            [cScale(a),oScale(0)],
            [cScale(a),oScale(0.15)]
          ])
        )
        axes.outer.ticks.minor.push(
          d3RadialLine()([
            [cScale(a),oScale(1)],
            [cScale(a),oScale(0.85)]
          ])
        )
      }
    }
    axes.outer.path = d3RadialLine()(
      gc.map((n,i)=>[cScale(i),oScale(1)])
    )
    axes.radial.path = d3RadialLine()([
      [cScale(0),rScale(radius)],
      [cScale(0),rScale(0)]
    ])
    axes.radial.ticks = {major:[],minor:[],labels:[]}
    for (let r = radius; r > 10; r /= 10){
      let len = String(Math.floor(r)).length-1
      let value = Math.pow(10,len)
      axes.radial.ticks.major.push(
        d3Line()([
          [cScale(0),-rScale(value)],
          [cScale(0)-2*len,-rScale(value)]
        ])
      )
      for (let m = 2; m < 10; m++){
        if (m*value < radius){
          axes.radial.ticks.minor.push(
            d3Line()([
              [cScale(0),-rScale(m*value)],
              [cScale(0)-len,-rScale(m*value)]
            ])
          )
        }
      }
      if (r > radius / 1000){
        axes.radial.ticks.labels.push(
          {
            path: d3Line()([
              [cScale(0)-2*len-80,-rScale(value)],
              [cScale(0)-2*len-5,-rScale(value)]
            ]),
            text: si(value),
            align: 'right'
          }
        )
        let points = []
        nXlen.forEach((n,i)=>{
          if (value <= nXlen[i])
          points.push([cScale(i),rScale(value)])
        })
        paths['radial_'+len] = d3RadialLine()(points)
        pathProps['radial_'+len] = {fill:'none',stroke:'#cccccc',strokeWidth:1, strokeDasharray:16}
      }
    }


    if (sum[999] < circumference){
      axes.inner.ticks.major.push(
        d3RadialLine()([
          [cScale(999),oScale(0)],
          [cScale(999),oScale(0.25)]
        ])
      )
      axes.outer.ticks.major.push(
        d3RadialLine()([
          [cScale(999),oScale(1)],
          [cScale(999),oScale(0.75)]
        ])
      )
      if (sum[999] < circumference * 0.98 && sum[999] > circumference * 0.25){
        axes.inner.ticks.labels.push(
          {
            path: d3RadialLine()([
              [cScale(959),oScale(0.4)],
              [cScale(1039),oScale(0.4)]
            ]),
            text: '100%'
          }
        )
      }
      paths.endGC = d3RadialLine()([
        [cScale(999),oScale(0)],
        [cScale(999),oScale(1)]
      ])
      pathProps.endGC = {fill:'none',stroke:'#cccccc',strokeWidth:2}
    }

    let format = d3format(".2s")
    let gcFormat = d3format(".1f")
    let legend = {
      'stats': [
        {
          label: 'Log10 scaffold count',
          value: 'total '+format(all.length),
          color: palette.colors[8]
        },
        {
          label: 'Scaffold length',
          value: 'total '+format(sum[999]),
          color: '#999999'
        },
        {
          label: 'Longest scaffold',
          value: format(all[0].z),
          color: palette.colors[5]
        },
        {
          label: 'N50 length',
          value: format(nXlen[499]),
          color: palette.colors[7]
        },
        {
          label: 'N90 length',
          value: format(nXlen[899]),
          color: palette.colors[6]
        }
      ],
      'composition': [
        {
          label: 'GC',
          value: gcFormat(100*composition.gc)+'%',
          color: palette.colors[1]
        },
        {
          label: 'AT',
          value: gcFormat(100*composition.at)+'%',
          color: palette.colors[0]
        }
      ]
    }
    if (composition.n > 0){
      legend.composition.push(
        {
          label: 'N',
          value: gcFormat(100*composition.n)+'%',
          color: 'white'
        }
      )
    }

    let scale = {
      circumference,
      radius
    }
    return { paths, pathProps, axes, legend, scale }
  }
)

const funcFromPattern = pattern => {
  return (def) => {
    let url = ''
    let parts = pattern.split(/[\{\}]/)
    for (let i = 0; i < parts.length; i++){
      if (parts[i]){
        url += i % 2 == 0 ? parts[i] : def[parts[i]]
      }
    }
    return url
  }
}

export const getLinks = createSelector(
  getSelectedDatasetMeta,
  (meta) => {
    let links = {dataset:[],record:[]}
    if (meta.dataset_links){
      Object.keys(meta.dataset_links).forEach(title=>{
        let pattern = meta.dataset_links[title]
        links.dataset.push({title,func:funcFromPattern(pattern)})
      })
    }
    if (meta.record_links){
      Object.keys(meta.record_links).forEach(title=>{
        let pattern = meta.record_links[title]
        links.record.push({title,func:funcFromPattern(pattern)})
      })
    }
    return links
  }
)

export const getTableData = createSelector(
  getMainPlotData,
  getAllActiveFields,
  getSelectedRecordsAsObject,
  getFilteredList,
  (state) => {
    let data = {}
    Object.keys(getAllActiveFields(state)).forEach(field=>{
      data[field] = getFilteredDataForFieldId(state,field)
    })
    return data
  },
  (state) => {
    let bins = {}
    let fields = getAllActiveFields(state)
    Object.keys(fields).forEach(field=>{
      if (fields[field].type == 'category'){
        bins[field] = getBinsForFieldId(state,field)
      }
    })
    return bins
  },
  getIdentifiersForList,
  getLinks,
  (plotData,fields,selected,list,data,bins,identifiers,links) => {
    let values = []
    let keys = {}
    let plot = plotData.meta
    list.forEach((_id,index) => {
      let row = {sel:Boolean(selected[_id]),_id}
      Object.keys(fields).forEach(field=>{
        row[field] = data[field].values[index] || 0
      })
      if(identifiers[index]){
        row['id'] = identifiers[index]
      }
      values.push(row)
    })
    Object.keys(fields).forEach(field=>{
      if (data[field].keys){
        keys[field] = data[field].keys
      }
    })
    return {values,keys,plot,fields,links}
  }
)

export const getCSVdata = createSelector(
  getTableData,
  data => {
    let values = data.values
    let keys = data.keys
    let arr = values.map(o=>{
      let entry = {}
      Object.keys(o).forEach(k=>{
        if (k != '_id' && k != 'sel'){
          if (keys[k]){
            entry[k] = keys[k][o[k]]
          }
          else {
            entry[k] = o[k]
          }
        }
      })
      return entry
    })
    return arr
  }
)

export const getBinnedColors = createSelector(
  getColorPalette,
  (state) => getBinsForFieldId(state,getMainPlot(state).axes.cat),
  (palette,bins) => {
    let colors = []
    bins.forEach((bin,i) => {
      bin.keys.forEach(k=>{
        colors[k] = palette.colors[i]
      })
    })
    return colors
  }

)
