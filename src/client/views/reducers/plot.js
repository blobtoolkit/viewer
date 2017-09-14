import { createAction, handleAction, handleActions } from 'redux-actions'
import { createSelector } from 'reselect'
import { byIdSelectorCreator } from './selectorCreators'
import immutableUpdate from 'immutable-update';
import deep from 'deep-get-set'
import store from '../store'


export const addPlot = createAction('ADD_PLOT')
export const editPlot = createAction('EDIT_PLOT')

export const plots = handleActions(
  {
    ADD_PLOT: (state, action) => (
      immutableUpdate(state, {
        byId: { [action.payload.id]: action.payload },
        allIds: [...state.allIds, action.payload.id]
      })
    ),
    EDIT_PLOT: (state, action) => {
      let id = action.payload.id
      let fields = Object.keys(action.payload).filter((key)=>{return key != 'id'})
      return immutableUpdate(state, {
        byId: {
          [id]: Object.assign(...fields.map(f => ({[f]: action.payload[f]})))
        }
      })
    }
  },
  {
    byId: {
      default: {
        x:'gc',
        y:'velvet_cov',
        z:'length',
        cat:'bestsum_phylum'
      }
    },
    allIds: ['default']
  }
)


export const selectPlot = createAction('SELECT_PLOT')

export const selectedPlot = handleAction(
  'SELECT_PLOT',
  (state, action) => {
    return action.payload
  },
  'default'
)
export const getSelectedPlot = state => state.selectedPlot
export const getAllPlots = state => state.plots

const createSelectorForPlotId = byIdSelectorCreator();
const _getPlotIdAsMemoKey = (state, plotId) => plotId;
const getMetaDataForPlot = (state, plotId) => state.plots ? state.plots.byId[plotId] : {};

export const getPlotByPlotId = createSelectorForPlotId(
  _getPlotIdAsMemoKey,
  getMetaDataForPlot,
  (plot) => plot
);

export const getMainPlot = createSelector(
  getSelectedPlot,
  (state) => getPlotByPlotId(state,getSelectedPlot(state)),
  (id, axes) => ({id,axes})
)

// export const setDisplayFirst = createAction('SET_DISPLAY_FIRST')
//
// export const displayFirst = handleAction(
//   'SET_DISPLAY_FIRST',
//   (state, action) => {
//     return action.payload
//   },
//   5
// )
// export const getDisplayFirst = state => store.getState().displayFirst


export const plotReducers = {
  plots,
  selectedPlot//,
  // displayFirst
}
