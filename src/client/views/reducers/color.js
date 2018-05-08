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
import { queryValue } from '../History'
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

export const addPalette = createAction('ADD_PALETTE')
export const editPalette = createAction('EDIT_PALETTE')

const qsPalette = () => {
  let colors = ['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)']
  for (let i = 0; i < colors.length; i++){
    let qsColor = queryValue('color'+i)
    if (qsColor){
      colors[i] = colorToRGB(qsColor) || colors[i]
    }
  }
  console.log(colors)
  return colors
}

export const palettes = handleActions(
  {
    ADD_PALETTE: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
    EDIT_PALETTE: (state, action) => {
      let id = action.payload.id
      return immutableUpdate(state, {
        byId: {
          [id]: action.payload[id]
        }
      })
    }
  },
  {
    byId: {
      default:['rgb(166,206,227)','rgb(31,120,180)','rgb(178,223,138)','rgb(51,160,44)','rgb(251,154,153)','rgb(227,26,28)','rgb(253,191,111)','rgb(255,127,0)','rgb(202,178,214)','rgb(106,61,154)'],
      user: qsPalette()
    },
    allIds: ['default','user']
  }
)


export const selectPalette = createAction('SELECT_PALETTE')
export const selectedPalette = handleSimpleByDatasetAction('SELECT_PALETTE')
const createSelectorForSelectedPalette = byIdSelectorCreator();
export const getSelectedPalette = createSelectorForSelectedPalette(
  getSelectedDatasetId,
  getSimpleByDatasetProperty('selectedPalette'),
  palette => palette || queryValue('palette') || 'default'
)

export const getAllPalettes = state => state.palettes

export const getColorPalette = createSelector(
  getSelectedPalette,
  getAllPalettes,
  (id, palettes) => {
    let colors = palettes ? palettes.byId[id] : []
    return {id,colors}
  }
)
export const colorReducers = {
  palettes,
  selectedPalette
}
