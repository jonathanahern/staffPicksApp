import * as APIUtil from "../util/help_api_util";

export const sendEmail = data => dispatch => (
  APIUtil.sendEmail(data).then(data => {
   return data
  })
);
