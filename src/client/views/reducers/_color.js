import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector, createSelectorCreator } from 'reselect'
import { byIdSelectorCreator,
  handleSimpleByDatasetAction,
  getSimpleByDatasetProperty,
  getSelectedDatasetId } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import shallow from 'shallowequal'
import store from '../store'
import { getQueryValue, addQueryValues } from '../reducers/history'
import convert from 'color-convert'

const colorToRGB = (color) => {
  if (color.match('rgb')){
    return color
  }
  else if (color.match('hsl')){
    color = color.replace('hsl(','').replace(')','').split(',')
    color = convert.hsl.rgb(color)
  }
  else {
    color = convert.keyword.rgb(color)
  }
  if (color){
    color = 'rgb('+color.join()+')'
  }
  return color
}

// export const addPalette = createAction('ADD_PALETTE')
// export const editPalette = createAction('EDIT_PALETTE')

const defaultColors = ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)']
const userColors = ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)']

const qsPalette = createSelector(
  () => getQueryValue('color0'),
  () => getQueryValue('color1'),
  () => getQueryValue('color2'),
  () => getQueryValue('color3'),
  () => getQueryValue('color4'),
  () => getQueryValue('color5'),
  () => getQueryValue('color6'),
  () => getQueryValue('color7'),
  () => getQueryValue('color8'),
  () => getQueryValue('color9'),
  () => console.log('qsPalette'),
  (c0,c1,c2,c3,c4,c5,c6,c7,c8,c9) => {
    let colors = [c0,c1,c2,c3,c4,c5,c6,c7,c8,c9]
    for (let i = 0; i < colors.length; i++){
      colors[i] = colors[i] ? colorToRGB(colors[i]) : userColors[i]
    }
    console.log(colors)
    return colors
  }
)

export const selectPalette = createAction('SELECT_PALETTE')
export const selectedPalette = handleSimpleByDatasetAction('SELECT_PALETTE')
const createSelectorForSelectedPalette = byIdSelectorCreator();
export const getSelectedPalette = createSelectorForSelectedPalette(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('selectedPalette'),
  () => getQueryValue('palette'),
  (palette,qsPalette) => {
    return qsPalette || palette || 'default'
  }
)


export const getAllPalettes = createSelector(
  () => defaultColors,
  state => qsPalette(state),
  (def, user) => {
    console.log(user)
    return {
      byId: {
        default:def, user
      },
      allIds: ['default','user']
    }
  }
)

// export const getAllPalettes = () => (
//   {
//     byId: {
//       default:defaultColors,
//       user: userColors
//     },
//     allIds: ['default','user']
//   }
// )

export const editPalette = (payload) => {
  let add = {}
  let remove = []
  payload[payload.id].forEach((color,i)=>{
    if (color != userColors[i]){
      add['color'+i] = color
    }
    else {
      remove.push('color'+i)
    }
  })
  addQueryValues(add)
}

export const getColorPalette = createSelector(
  getSelectedPalette,
  getAllPalettes,
  (id, palettes) => {
    let colors = palettes ? palettes.byId[id] : []
    console.log({id,colors})
    return {id,colors}
  }
)

export const colorReducers = {
  //palettes,
  selectedPalette
}
