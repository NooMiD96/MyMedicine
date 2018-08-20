import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { message } from 'antd';
import { AppThunkAction } from 'src/reducer';
import { actionCreators as AuthActions } from 'src/components/authorization/reducer';
// ----------------- STATE -----------------
//#region STATE
export interface SymptomsState {
  Symptoms: Symptom[];
  Pending: boolean;
  ErrorInner: string;
}
export interface Symptom {
  SymptomId: number;
  Name: string;
}
//#endregion STATE
// ----------------- ACTIONS -----------------
//#region ACTIONS
interface SymptomsRequestAction {
  type: 'SYMPTOMS_REQUEST';
}
interface SymptomsRequestSuccessAction {
  type: 'SYMPTOMS_REQUEST_SUCCESS';
  Symptoms: Symptom[];
}
interface SymptomsRequestErrorAction {
  type: 'SYMPTOMS_REQUEST_ERROR';
  ErrorInner: string;
}
type GetSymptomsAction = SymptomsRequestAction | SymptomsRequestSuccessAction | SymptomsRequestErrorAction;

interface ChangeSymptomsRequestAction {
  type: 'CHANGE_SYMPTOMS_REQUEST';
}
interface ChangeSymptomsRequestSuccessAction {
  type: 'CHANGE_SYMPTOMS_REQUEST_SUCCESS';
}
interface ChangeSymptomsRequestErrorAction {
  type: 'CHANGE_SYMPTOMS_REQUEST_ERROR';
  ErrorInner: string;
}
type ChangeSymptomsAction = ChangeSymptomsRequestAction | ChangeSymptomsRequestSuccessAction | ChangeSymptomsRequestErrorAction;

interface DeleteSymptomsRequestAction {
  type: 'DELETE_SYMPTOMS_REQUEST';
}
interface DeleteSymptomsRequestSuccessAction {
  type: 'DELETE_SYMPTOMS_REQUEST_SUCCESS';
}
interface DeleteSymptomsRequestErrorAction {
  type: 'DELETE_SYMPTOMS_REQUEST_ERROR';
  ErrorInner: string;
}
type DeleteSymptomsAction = DeleteSymptomsRequestAction | DeleteSymptomsRequestSuccessAction | DeleteSymptomsRequestErrorAction;

interface AddNewSymptomAction {
  type: 'ADD_NEW_SYMPTOM';
  symptom: Symptom;
}
interface SetNewValueAction {
  type: 'SET_NEW_VALUE';
  symptom: Symptom;
}
interface DeleteLocalSymptomsAction {
  type: 'DELETE_LOCAL_SYMPTOMS';
  symptomIds: number[];
}
interface CleanErrorInnerAction {
  type: 'CLEAN_ERROR_INNER';
}

type KnownAction = GetSymptomsAction | ChangeSymptomsAction | DeleteSymptomsAction
  | AddNewSymptomAction | SetNewValueAction | DeleteLocalSymptomsAction
  | CleanErrorInnerAction;
//#endregion ACTIONS
// ---------------- ACTION CREATORS ----------------
//#region ACTION CREATORS
interface ResponseType { Error: string; Symptoms: Symptom[]; }

export const actionCreators = {
  GetSymptoms: (): AppThunkAction<GetSymptomsAction> => (dispatch, getState) => {
    const fetchTask = fetch(`/api/symptoms/getsymptoms`, {
      credentials: 'same-origin',
      method: 'GET',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' }
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).then((data: ResponseType) => {
      if (data.Error === 'auth') {
        AuthActions.LogOut()(dispatch as any, getState);
        message.error('Need auth again');
        dispatch({ type: 'SYMPTOMS_REQUEST_ERROR', ErrorInner: '' });
        return;
      }
      if (data.Error) {
        throw new Error('Some trouble when getting posts.\n' + data.Error);
      }
      dispatch({ type: 'SYMPTOMS_REQUEST_SUCCESS', Symptoms: data.Symptoms });
    }).catch((err: Error) => {
      console.warn('Error :-S in user\n', err.message);
      console.warn(err.stack);
      dispatch({ type: 'SYMPTOMS_REQUEST_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'SYMPTOMS_REQUEST' });
  },
  ChangeSymptoms: (editList: number[]): AppThunkAction<ChangeSymptomsAction | DeleteLocalSymptomsAction> => (dispatch, getState) => {
    const { Symptoms } = getState().symptoms;
    const symptoms = Symptoms.filter(x => editList.includes(x.SymptomId));

    const fetchTask = fetch(`/api/symptoms/changesymptoms`, {
      credentials: 'same-origin',
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json; charset=UTF-8' },
      body: JSON.stringify(symptoms)
    }).then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }
      return response.json();
    }).then((data: ResponseType) => {
      if (data.Error === 'auth') {
        AuthActions.LogOut()(dispatch as any, getState);
        message.error('Need auth again');
        dispatch({ type: 'CHANGE_SYMPTOMS_REQUEST_ERROR', ErrorInner: '' });
        return;
      }
      if (data.Error) {
        throw new Error('Some trouble when getting posts.\n' + data.Error);
      }
      dispatch({
        type: 'DELETE_LOCAL_SYMPTOMS',
        symptomIds: editList
      });
      dispatch({ type: 'CHANGE_SYMPTOMS_REQUEST_SUCCESS' });
      actionCreators.GetSymptoms()(dispatch as any, getState);
    }).catch((err: Error) => {
      console.log('Error :-S in user\n', err.message);
      dispatch({ type: 'CHANGE_SYMPTOMS_REQUEST_ERROR', ErrorInner: err.message });
    });

    addTask(fetchTask);
    dispatch({ type: 'CHANGE_SYMPTOMS_REQUEST' });
  },
  DeleteSymptoms: (deleteList: number[]): AppThunkAction<DeleteSymptomsAction | DeleteLocalSymptomsAction> => (dispatch, getState) => {
    const localElements = deleteList.filter(x => x < 0);
    if (localElements.length === deleteList.length) {
      dispatch({
        type: 'DELETE_LOCAL_SYMPTOMS',
        symptomIds: localElements
      });
    } else {
      const requestElemets = deleteList.filter(x => x > 0);

      const fetchTask = fetch(`/api/symptoms/deletesymptoms`, {
        credentials: 'same-origin',
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        body: JSON.stringify(requestElemets)
      }).then(response => {
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        return response.json();
      }).then((data: ResponseType) => {
        if (data.Error === 'auth') {
          AuthActions.LogOut()(dispatch as any, getState);
          message.error('Need auth again');
          dispatch({ type: 'DELETE_SYMPTOMS_REQUEST_ERROR', ErrorInner: '' });
          return;
        }
        if (data.Error) {
          throw new Error('Some trouble when getting posts.\n' + data.Error);
        }
        dispatch({ type: 'DELETE_SYMPTOMS_REQUEST_SUCCESS' });
        dispatch({
          type: 'DELETE_LOCAL_SYMPTOMS',
          symptomIds: localElements
        });
        actionCreators.GetSymptoms()(dispatch as any, getState);
      }).catch((err: Error) => {
        console.log('Error :-S in user\n', err.message);
        dispatch({ type: 'DELETE_SYMPTOMS_REQUEST_ERROR', ErrorInner: err.message });
      });

      addTask(fetchTask);
      dispatch({ type: 'DELETE_SYMPTOMS_REQUEST' });
    }
  },
  AddNewSymptom: (symptom: Symptom) => <AddNewSymptomAction>{ type: 'ADD_NEW_SYMPTOM', symptom },
  SetNewValue: (symptom: Symptom) => <SetNewValueAction>{ type: 'SET_NEW_VALUE', symptom },
  CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' }
};
//#endregion ACTION CREATORS
// ---------------- REDUCER ----------------
//#region REDUCER
const unloadedState: SymptomsState = {
  Symptoms: [],
  Pending: false,
  ErrorInner: ''
};

export const reducer: Reducer<SymptomsState> = (state: SymptomsState, action: KnownAction) => {
  switch (action.type) {
    case 'DELETE_SYMPTOMS_REQUEST':
    case 'CHANGE_SYMPTOMS_REQUEST':
    case 'SYMPTOMS_REQUEST':
      return {
        ...state,
        Pending: true
      };

    case 'DELETE_SYMPTOMS_REQUEST_SUCCESS':
    case 'CHANGE_SYMPTOMS_REQUEST_SUCCESS':
      return state;

    case 'SYMPTOMS_REQUEST_SUCCESS':
      return {
        ...state,
        Pending: false,
        Symptoms: [
          ...state.Symptoms.filter(x => x.SymptomId < 0),
          ...action.Symptoms
        ]
      };

    case 'DELETE_SYMPTOMS_REQUEST_ERROR':
    case 'CHANGE_SYMPTOMS_REQUEST_ERROR':
    case 'SYMPTOMS_REQUEST_ERROR':
      return {
        ...state,
        Pending: false,
        ErrorInner: action.ErrorInner
      };

    case 'ADD_NEW_SYMPTOM':
      return {
        ...state,
        Symptoms: [
          action.symptom,
          ...state.Symptoms
        ]
      };

    case 'SET_NEW_VALUE':
      return {
        ...state,
        Symptoms: state.Symptoms.map(x => x.SymptomId === action.symptom.SymptomId
          ? action.symptom
          : x
        )
      };

    case 'DELETE_LOCAL_SYMPTOMS':
      return {
        ...state,
        Symptoms: state.Symptoms.filter(x => !action.symptomIds.includes(x.SymptomId))
      };

    case 'CLEAN_ERROR_INNER':
      return {
        ...state,
        ErrorInner: ''
      };

    default:
      const exhaustiveCheck: never = action;
  }

  return state || unloadedState;
};
//#endregion REDUCER
