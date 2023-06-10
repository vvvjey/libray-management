import actionTypes from './actionTypes';
import { toast } from 'react-toastify';
import {
    getAllRentsService,
    CreateRentSevice,
    CreateRentDetailService,
    getAllRentDetailsService
} from '../../services/rentService';
import {
    createNewCustomerService,
    getAllCustomers,
    editCustomerService,
    deleteCustomerService
} from '../../services/customerService'
import { reject, tail } from 'lodash';
//BOOK
// create rent with not exists customer
export const CreateRentNotExistsCustomer = (dataCustomer, dataRent, dataBook) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewCustomerService(dataCustomer);
            if (res && res.errCode === 0) {
                const modifiedDataRent = {
                    ...dataRent,
                    customerId: res.newCustomerId
                };
                dispatch(CreateRentExistsCustomer(modifiedDataRent, dataBook))
            }
        }
        catch (e) {
            dispatch(saveRentFailed());
        }
    }
}
// create invoice with exists customer
export const CreateRentExistsCustomer = (dataRent, dataBook) => {
    return async (dispatch, getState) => {
        try {
            let res = await CreateRentSevice(dataRent);
            if (res && res.errCode === 0) {
                let rentId = res.rentId;
                const apiCalls = dataBook.map(async (book) => {
                    const modifiedData = {
                        ...book,
                        rentDetailId: rentId
                    };
                    let resCreateRentDetail = await CreateRentDetailService(modifiedData);
                    return resCreateRentDetail;
                });
                await Promise.all(apiCalls);
                toast.success("Create a new rent succeed!");
            } else {
                toast.error("Create a new rent failed!");
                dispatch(saveRentFailed());
            }
        } catch (e) {
            toast.error("Create a new rent failed!");
            dispatch(saveRentFailed());
        }
    };
};

export const saveRentSuccess = () => ({
    type: actionTypes.CREATE_RENT_SUCCESS
})
export const saveRentFailed = () => ({
    type: actionTypes.CREATE_RENT_FAILED
})

export const CreateRentDetail = (dataRentDetail) => {
    return async (dispatch, getState) => {
        try {
            let res = await CreateRentDetailService(dataRentDetail);
            if (res && res.errCode === 0) {
                // toast.success("Create a new invoice detail succeed !")
                dispatch(saveRentDetailSuccess());
            } else {
                // toast.error("Create a new invoice detail error !")
                dispatch(saveRentDetailFailed());
            }
        } catch (e) {
            dispatch(saveRentDetailFailed());
        }
    }
}

export const saveRentDetailSuccess = () => ({
    type: actionTypes.CREATE_RENT_DETAIL_SUCCESS
})
export const saveRentDetailFailed = () => ({
    type: actionTypes.CREATE_RENT_DETAIL_FAILED
})

export const fetchAllRents = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllRentsService(id);
            if (res && res.errCode === 0) {
                if (id !== "ALL") {
                    return res.rents
                }
                toast.success("Fetch all rents succeed")
                dispatch(
                    fetchAllRentsSuccess(res.rents.reverse())
                );
            } else {
                toast.error("Fetch all rents error")
                dispatch(fetchAllRentsFailed());
            }
        } catch (e) {
            dispatch(fetchAllRentsFailed());
        }
    }
}

export const fetchAllRentsSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_RENTS_SUCCESS,
    dataRents: data
})

export const fetchAllRentsFailed = () => ({
    type: actionTypes.FETCH_ALL_RENTS_FAILED
})

export const fetchAllRentsDetail = (id) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllRentDetailsService(id);
            if (res && res.errCode === 0) {
                if (id !== "ALL") {
                    return res.rentsDetail
                }
                toast.success("Fetch all rents detail succeed")
                dispatch(
                    fetchAllRentsDetailSuccess(res.rents.reverse())
                );
            } else {
                toast.error("Fetch all rents detail error")
                dispatch(fetchAllRentsDetailFailed());
            }
        } catch (e) {
            dispatch(fetchAllRentsDetailFailed());
        }
    }
}

export const fetchAllRentsDetailSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_RENTS_DETAIL_SUCCESS,
    dataRentDetail: data
})

export const fetchAllRentsDetailFailed = () => ({
    type: actionTypes.FETCH_ALL_RENTS_DETAIL_FAILED
})