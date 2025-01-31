import { hideLoading, showLoading } from "react-redux-loading-bar";
import { ENVIRONMENT } from "@mds/common";
import { createRequestHeader } from "../utils/RequestHeaders";
import { success, error, request } from "../actions/genericActions";
import { GET_ACTIVITIES } from "../constants/reducerTypes";
import CustomAxios from "../customAxios";
import { storeActivities } from "../actions/activityActions";
import { ACTIVITIES, ACTIVITIES_MARK_AS_READ } from "../constants/API";
import { AppThunk } from "@/store/appThunk.type";
import { AxiosResponse } from "axios";
import { IActivity } from "@mds/common";

export const fetchActivities = (
  user: string,
  page = 1,
  per_page = 20
): AppThunk<Promise<AxiosResponse<IActivity>>> => (dispatch) => {
  dispatch(storeActivities({}));
  dispatch(request(GET_ACTIVITIES));
  dispatch(showLoading());
  const headers = {
    ...createRequestHeader(),
    params: {
      user,
      page,
      per_page,
    },
  };
  return CustomAxios()
    .get(`${ENVIRONMENT.apiUrl}${ACTIVITIES()}`, headers)
    .then((response) => {
      dispatch(success(GET_ACTIVITIES));
      dispatch(storeActivities(response.data));
      return response;
    })
    .catch((err) => {
      dispatch(error(GET_ACTIVITIES));
      throw new Error(err);
    })
    .finally(() => dispatch(hideLoading()));
};

export const markActivitiesAsRead = (activity_guids: string[]): AppThunk => (dispatch) => {
  dispatch(showLoading());
  const headers = {
    ...createRequestHeader(),
  };
  return CustomAxios()
    .patch(`${ENVIRONMENT.apiUrl}${ACTIVITIES_MARK_AS_READ()}`, { activity_guids }, headers)
    .then(() => {
      dispatch(success(GET_ACTIVITIES));
    })
    .catch((err) => {
      dispatch(error(GET_ACTIVITIES));
      throw new Error(err);
    })
    .finally(() => dispatch(hideLoading()));
};
