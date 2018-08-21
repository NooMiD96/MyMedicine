import { Reducer } from 'redux';
import { fetch, addTask } from 'domain-task';
import { message } from 'antd';
import { isDate } from 'moment';

import { AppThunkAction } from 'src/reducer';
import { actionCreators as AuthActions } from 'src/components/authorization/reducer';
// ----------------- STATE -----------------
export interface VisitationState {
    Data: Separation[] | Doctor[] | Visitor[];
    Pending: boolean;
    ErrorInner: string;
}
export interface Separation {
    Id: number;
    Address: string;
}
export interface Doctor {
    Id: number;
    FirstName: string;
    SecondName: string;
}
export interface Visitor {
    Id: number;
    FirstName: string;
    SecondName: string;
    Date: Date;
    Male: boolean;
}
// ----------------- ACTIONS -----------------
interface GetSeparationsRequestAction {
    type: 'GET_SEPARATIONS_REQUEST';
}
interface GetSeparationsRequestSuccessAction {
    type: 'GET_SEPARATIONS_REQUEST_SUCCESS';
    Separations: Separation[];
}
interface GetSeparationsRequestErrorAction {
    type: 'GET_SEPARATIONS_REQUEST_ERROR';
    ErrorInner: string;
}
type GetSeparationsAction = GetSeparationsRequestAction | GetSeparationsRequestSuccessAction | GetSeparationsRequestErrorAction;

interface GetDoctorsRequestAction {
    type: 'GET_DOCTORS_REQUEST';
}
interface GetDoctorsRequestSuccessAction {
    type: 'GET_DOCTORS_REQUEST_SUCCESS';
    Doctors: Doctor[];
}
interface GetDoctorsRequestErrorAction {
    type: 'GET_DOCTORS_REQUEST_ERROR';
    ErrorInner: string;
}
type GetDoctorsAction = GetDoctorsRequestAction | GetDoctorsRequestSuccessAction | GetDoctorsRequestErrorAction;

interface GetVisitorsRequestAction {
    type: 'GET_VISITORS_REQUEST';
}
interface GetVisitorsRequestSuccessAction {
    type: 'GET_VISITORS_REQUEST_SUCCESS';
    Visitors: Visitor[];
}
interface GetVisitorsRequestErrorAction {
    type: 'GET_VISITORS_REQUEST_ERROR';
    ErrorInner: string;
}
type GetVisitorsAction = GetVisitorsRequestAction | GetVisitorsRequestSuccessAction | GetVisitorsRequestErrorAction;

interface AddNewSeparationRequestAction {
    type: 'ADD_NEW_SEPARATION_REQUEST';
}
interface AddNewSeparationRequestSuccessAction {
    type: 'ADD_NEW_SEPARATION_REQUEST_SUCCESS';
}
interface AddNewSeparationRequestErrorAction {
    type: 'ADD_NEW_SEPARATION_REQUEST_ERROR';
    ErrorInner: string;
}
type AddNewSeparationAction = AddNewSeparationRequestAction | AddNewSeparationRequestSuccessAction | AddNewSeparationRequestErrorAction;

interface AddNewDoctorRequestAction {
    type: 'ADD_NEW_DOCTOR_REQUEST';
}
interface AddNewDoctorRequestSuccessAction {
    type: 'ADD_NEW_DOCTOR_REQUEST_SUCCESS';
}
interface AddNewDoctorRequestErrorAction {
    type: 'ADD_NEW_DOCTOR_REQUEST_ERROR';
    ErrorInner: string;
}
type AddNewDoctorAction = AddNewDoctorRequestAction | AddNewDoctorRequestSuccessAction | AddNewDoctorRequestErrorAction;

interface AddNewVisitorRequestAction {
    type: 'ADD_NEW_VISITOR_REQUEST';
}
interface AddNewVisitorRequestSuccessAction {
    type: 'ADD_NEW_VISITOR_REQUEST_SUCCESS';
}
interface AddNewVisitorRequestErrorAction {
    type: 'ADD_NEW_VISITOR_REQUEST_ERROR';
    ErrorInner: string;
}
type AddNewVisitorAction = AddNewVisitorRequestAction | AddNewVisitorRequestSuccessAction | AddNewVisitorRequestErrorAction;

interface CleanErrorInnerAction {
    type: 'CLEAN_ERROR_INNER';
}

type KnownAction = GetSeparationsAction | GetDoctorsAction | GetVisitorsAction
    | AddNewSeparationAction | AddNewDoctorAction | AddNewVisitorAction
    | CleanErrorInnerAction;
// ---------------- ACTION CREATORS ----------------
interface ResponseType { Error: string; }
interface SeparationResponseType { Error: string; Separations: any[]; }
interface DoctorResponseType { Error: string; Doctors: any[]; }
interface VisitorResponseType { Error: string; Visitors: any[]; }

export const actionCreators = {
    GetSeparations: (): AppThunkAction<GetSeparationsAction> => (dispatch, getState) => {
        const fetchTask = fetch('/api/visitation/getseparations', {
            credentials: 'same-origin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data: SeparationResponseType) => {
            if (data.Error) {
                if (data.Error === 'auth') {
                    AuthActions.LogOut()(dispatch as any, getState);
                    message.error('Need auth again');
                    dispatch({ type: 'GET_SEPARATIONS_REQUEST_ERROR', ErrorInner: '' });
                    return;
                }
                throw new Error('Some trouble when getting posts.\n' + data.Error);
            }
            const Separations = data.Separations.map((value: any) => ({
                Id: value.SeparationId,
                Address: value.Address,
            }));
            dispatch({ type: 'GET_SEPARATIONS_REQUEST_SUCCESS', Separations });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'GET_SEPARATIONS_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'GET_SEPARATIONS_REQUEST' });
    },
    GetDoctors: (separation: Separation): AppThunkAction<GetDoctorsAction> => (dispatch, getState) => {
        const fetchTask = fetch(`/api/visitation/getdoctors?sep=${separation.Id}`, {
            credentials: 'same-origin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data: DoctorResponseType) => {
            if (data.Error) {
                if (data.Error === 'auth') {
                    AuthActions.LogOut()(dispatch as any, getState);
                    message.error('Need auth again');
                    dispatch({ type: 'GET_DOCTORS_REQUEST_ERROR', ErrorInner: '' });
                    return;
                }
                throw new Error('Some trouble when getting posts.\n' + data.Error);
            }
            const Doctors = data.Doctors.map((value: any) => ({
                Id: value.DoctorId,
                FirstName: value.FirstName,
                SecondName: value.SecondName,
            }));
            dispatch({ type: 'GET_DOCTORS_REQUEST_SUCCESS', Doctors });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'GET_DOCTORS_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'GET_DOCTORS_REQUEST' });
    },
    GetVisitors: (doctor: Doctor): AppThunkAction<GetVisitorsAction> => (dispatch, getState) => {
        const fetchTask = fetch(`/api/visitation/getvisitors?doc=${doctor.Id}`, {
            credentials: 'same-origin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data: VisitorResponseType) => {
            if (data.Error) {
                if (data.Error === 'auth') {
                    AuthActions.LogOut()(dispatch as any, getState);
                    message.error('Need auth again');
                    dispatch({ type: 'GET_VISITORS_REQUEST_ERROR', ErrorInner: '' });
                    return;
                }
                throw new Error('Some trouble when getting posts.\n' + data.Error);
            }
            const Visitors = data.Visitors.map((value: any) => ({
                Id: value.VisitationId,
                FirstName: value.FirstName,
                SecondName: value.SecondName,
                Date: isDate(value.Date)
                    ? value.Date
                    : new Date(value.Date),
                Male: value.Male,
            }));
            dispatch({ type: 'GET_VISITORS_REQUEST_SUCCESS', Visitors });
        }).catch((err: Error) => {
            console.warn('Error :-S in user\n', err.message);
            console.warn(err.stack);
            dispatch({ type: 'GET_VISITORS_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'GET_VISITORS_REQUEST' });
    },
    AddNewSeparations: (separation: string): AppThunkAction<AddNewSeparationAction> => (dispatch, getState) => {
        const fetchTask = fetch('/api/visitation/addnewseparation', {
            credentials: 'same-origin',
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({Address: separation}),
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data: ResponseType) => {
            if (data.Error) {
                if (data.Error === 'auth') {
                    AuthActions.LogOut()(dispatch as any, getState);
                    message.error('Need auth again');
                    dispatch({ type: 'ADD_NEW_SEPARATION_REQUEST_ERROR', ErrorInner: '' });
                    return;
                }
                throw new Error('Some trouble when getting posts.\n' + data.Error);
            }
            actionCreators.GetSeparations()(dispatch as any, getState);
            dispatch({ type: 'ADD_NEW_SEPARATION_REQUEST_SUCCESS' });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'ADD_NEW_SEPARATION_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'ADD_NEW_SEPARATION_REQUEST' });
    },
    AddNewDoctor: (separation: Separation, doctor: Doctor): AppThunkAction<AddNewDoctorAction> => (dispatch, getState) => {
        const fetchTask = fetch(`/api/visitation/addnewdoctor?sep=${separation.Id}`, {
            credentials: 'same-origin',
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(doctor),
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data: ResponseType) => {
            if (data.Error) {
                if (data.Error === 'auth') {
                    AuthActions.LogOut()(dispatch as any, getState);
                    message.error('Need auth again');
                    dispatch({ type: 'ADD_NEW_DOCTOR_REQUEST_ERROR', ErrorInner: '' });
                    return;
                }
                throw new Error('Some trouble when getting posts.\n' + data.Error);
            }
            actionCreators.GetDoctors(separation)(dispatch as any, getState);
            dispatch({ type: 'ADD_NEW_DOCTOR_REQUEST_SUCCESS' });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'ADD_NEW_DOCTOR_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'ADD_NEW_DOCTOR_REQUEST' });
    },
    AddNewVisitor: (doctor: Doctor, visitor: Visitor): AppThunkAction<AddNewVisitorAction> => (dispatch, getState) => {
        const fetchTask = fetch(`/api/visitation/addnewvisitor?doc=${doctor.Id}`, {
            credentials: 'same-origin',
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(visitor),
        }).then(response => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then((data: ResponseType) => {
            if (data.Error) {
                if (data.Error === 'auth') {
                    AuthActions.LogOut()(dispatch as any, getState);
                    message.error('Need auth again');
                    dispatch({ type: 'ADD_NEW_VISITOR_REQUEST_ERROR', ErrorInner: '' });
                    return;
                }
                throw new Error('Some trouble when getting posts.\n' + data.Error);
            }
            actionCreators.GetVisitors(doctor)(dispatch as any, getState);
            dispatch({ type: 'ADD_NEW_VISITOR_REQUEST_SUCCESS' });
        }).catch((err: Error) => {
            console.log('Error :-S in user\n', err.message);
            dispatch({ type: 'ADD_NEW_VISITOR_REQUEST_ERROR', ErrorInner: err.message });
        });

        addTask(fetchTask);
        dispatch({ type: 'ADD_NEW_VISITOR_REQUEST' });
    },
    CleanErrorInner: () => <CleanErrorInnerAction>{ type: 'CLEAN_ERROR_INNER' },
};
// ---------------- REDUCER ----------------
const unloadedState: VisitationState = {
    Data: [],
    Pending: false,
    ErrorInner: '',
};

export const reducer: Reducer<VisitationState> = (state: VisitationState, action: KnownAction) => {
    switch (action.type) {
        case 'GET_VISITORS_REQUEST':
        case 'GET_DOCTORS_REQUEST':
        case 'GET_SEPARATIONS_REQUEST':
            return {
                ...state,
                Pending: true,
                Data: [],
            };

        case 'ADD_NEW_VISITOR_REQUEST':
        case 'ADD_NEW_DOCTOR_REQUEST':
        case 'ADD_NEW_SEPARATION_REQUEST':
            return {
                ...state,
                Pending: true,
            };

        case 'GET_VISITORS_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                Data: action.Visitors,
            };

        case 'GET_DOCTORS_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                Data: action.Doctors,
            };

        case 'GET_SEPARATIONS_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: false,
                Data: action.Separations,
            };

        case 'ADD_NEW_VISITOR_REQUEST_SUCCESS':
        case 'ADD_NEW_DOCTOR_REQUEST_SUCCESS':
        case 'ADD_NEW_SEPARATION_REQUEST_SUCCESS':
            return {
                ...state,
                Pending: true,
            };

        case 'ADD_NEW_VISITOR_REQUEST_ERROR':
        case 'ADD_NEW_DOCTOR_REQUEST_ERROR':
        case 'ADD_NEW_SEPARATION_REQUEST_ERROR':
        case 'GET_VISITORS_REQUEST_ERROR':
        case 'GET_DOCTORS_REQUEST_ERROR':
        case 'GET_SEPARATIONS_REQUEST_ERROR':
            return {
                ...state,
                Pending: false,
            };

        case 'CLEAN_ERROR_INNER':
            return {
                ...state,
                ErrorInner: '',
            };

        default:
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
