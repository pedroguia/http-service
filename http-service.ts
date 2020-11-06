import axios from 'axios';

import store from '../../store/store';
import { sharedOperations } from '../redux';

import { isDefined } from '../helpers/utils';
import i18n from '../i18n/i18n';
import environment from './environment';

const replace = require('key-value-replace');

const host: string = environment.apiBaseUrl;

interface OptionsProps {
  data?: any; // [FromBody]
  headers?: any;
  urlParams?: any; // [FromRoute]
  queryParams?: any; // [FromQuery]
  hideLoading?: boolean;
  isExternal?: boolean;
  defaultValueError?: any;
  showAlertIfError?: boolean;
  alertMsgIfSuccess?: string;
}

/**
 * Replaces strings defined on the endpoint (ex: '/:id') with the values in the 'urlParams'.
 */
const createToken = (endpoint: string, urlParams?: any) => {
  return isDefined(urlParams) ? replace(endpoint, urlParams, [':', ':']) : endpoint;
};

const generateUrl = (endpoint: string, urlParams?: any, isExternal?: boolean) => {
  const token: string = createToken(endpoint, urlParams);
  return isExternal ? token : `${host}${token}`;
};

/**
 * Handles the notification that is lauched by a request on certain conditions
 */
const generateAlert = (
  isSuccess: boolean,
  errorMsg: string,
  showAlertIfError?: boolean,
  alertMsgIfSuccess?: string
) => {
  if (isSuccess) {
    if (alertMsgIfSuccess)
      store.dispatch(
        sharedOperations.launchAlert({
          message: i18n.t(alertMsgIfSuccess),
          variant: 'success',
        })
      );
  } else if (showAlertIfError)
    store.dispatch(
      sharedOperations.launchAlert({
        message: errorMsg,
        variant: 'error',
      })
    );
};

/**
 * Handles what every request should return to the app, a success boolean and a value, based on the response from the server.
 */
const handleReturn = (
  response: any,
  defaultValueError: any,
  showAlertIfError?: boolean,
  alertMsgIfSuccess?: string
) => {
  let errorMsg = i18n.t('alert.error.unexpected');
  let ObjToReturn = {
    isSuccess: false,
    result: defaultValueError,
  };

  const isOnline = window.navigator.onLine;
  const serverError =
    !isDefined(response) ||
    response.status === 400 ||
    response.status === 404 ||
    response.status === 415 ||
    response.status === 500;

  if (!isOnline) errorMsg = i18n.t('alert.error.internet-connection');
  else if (!serverError) {
    const { isSuccess, result, applicationMessages } = response.data;

    if (isDefined(applicationMessages)) {
      const errorKey = applicationMessages[0];
      const errorVar = applicationMessages[1];
      errorMsg = i18n.t(`server-errors.${errorKey}`, { var: errorVar });
    }

    const resultToReturn =
      !isDefined(result) && isDefined(defaultValueError) ? defaultValueError : result;

    ObjToReturn = { isSuccess, result: resultToReturn };
  }

  generateAlert(ObjToReturn.isSuccess, errorMsg, showAlertIfError, alertMsgIfSuccess);
  return ObjToReturn;
};

const httpService = {
  post: async (
    endpoint: string,
    {
      data,
      headers,
      urlParams,
      isExternal,
      defaultValueError = '',
      showAlertIfError,
      alertMsgIfSuccess,
    }: OptionsProps = {}
  ) => {
    const url = generateUrl(endpoint, urlParams, isExternal);
    const resp = await axios.post(url, data, { headers }).catch(error => {
      return error.response;
    });

    return handleReturn(resp, defaultValueError, showAlertIfError, alertMsgIfSuccess);
  },

  put: async (
    endpoint: string,
    {
      data,
      headers,
      urlParams,
      isExternal,
      defaultValueError = '',
      showAlertIfError,
      alertMsgIfSuccess,
    }: OptionsProps = {}
  ) => {
    const url = generateUrl(endpoint, urlParams, isExternal);
    const resp = await axios.put(url, data, { headers }).catch(error => {
      return error.response;
    });

    return handleReturn(resp, defaultValueError, showAlertIfError, alertMsgIfSuccess);
  },

  get: async (
    endpoint: string,
    {
      headers,
      urlParams,
      queryParams: params,
      isExternal,
      defaultValueError = '',
      showAlertIfError,
      alertMsgIfSuccess,
    }: OptionsProps = {}
  ) => {
    const url = generateUrl(endpoint, urlParams, isExternal);
    const resp = await axios.get(url, { headers, params }).catch(error => {
      return error.response;
    });

    return handleReturn(resp, defaultValueError, showAlertIfError, alertMsgIfSuccess);
  },

  delete: async (
    endpoint: string,
    {
      headers,
      urlParams,
      queryParams: params,
      isExternal,
      defaultValueError = '',
      showAlertIfError,
      alertMsgIfSuccess,
    }: OptionsProps
  ) => {
    const url = generateUrl(endpoint, urlParams, isExternal);
    const resp = await axios.delete(url, { headers, params }).catch(error => {
      return error.response;
    });

    return handleReturn(resp, defaultValueError, showAlertIfError, alertMsgIfSuccess);
  },
};

export default httpService;
