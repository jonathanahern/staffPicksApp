import * as APIUtil from "../util/setting_api_util";

export const RECEIVE_SETTING = "RECEIVE_SETTING";
export const RECEIVE_PAGE_DATA = "RECEIVE_PAGE_DATA";

const receiveSetting = (setting) => ({
  type: RECEIVE_SETTING,
  setting,
});

const receivePageData = (pageData) => ({
  type: RECEIVE_PAGE_DATA,
  pageData,
});


export const fetchSetting = (shopId) => (dispatch) =>
  APIUtil.fetchSetting(shopId).then((setting) =>
    dispatch(receiveSetting(setting))
  );

export const updateSetting = (setting) => (dispatch) =>
  APIUtil.updateSetting(setting).then((setting) =>
    dispatch(receiveSetting(setting))
  );

export const createStaffPage = pageData => dispatch => (
  APIUtil.createStaffPage(pageData).then(pageData => {
    dispatch(receivePageData(pageData));
  })
);
