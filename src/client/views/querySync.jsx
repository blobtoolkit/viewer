import ReduxQuerySync from 'redux-query-sync'
import { getSelectedDataset } from './reducers/dataset'
import { selectDataset } from './reducers/repository'
import { getPlotShape, setPlotShape } from './reducers/plotParameters'



const storeEnhancer = ReduxQuerySync.enhancer({
    params: {
      dataset: {
          selector: state => getSelectedDataset(state),
          action: value => ({type: selectDataset(), payload: 'ds4'}),
          defaultValue: '',
      },
      plotShape: {
          selector: state => getPlotShape(state),
          action: value => ({type: setPlotShape(), payload: 'hex'}),

          // Cast the parameter value to a number (we map invalid values to 1, which will then
          // hide the parameter).
          stringToValue: string => Number.parseInt(string) || 1,

          // We then also specify the inverse function (this example one is the default)
          valueToString: value => `${value}`,

          // When state.pageNumber equals 1, the parameter p is hidden (and vice versa).
          defaultValue: 1,
      },
    },
    initialTruth: 'location',

    // Use replaceState so the browser's back/forward button will skip over these page changes.
    replaceState: true,
})

export default storeEnhancer;
