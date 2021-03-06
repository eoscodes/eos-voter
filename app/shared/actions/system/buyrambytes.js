import * as types from '../types';

import { getAccount } from '../accounts';
import eos from '../helpers/eos';

export function buyrambytes(amount) {
  return (dispatch: () => void, getState) => {
    const {
      connection,
      settings
    } = getState();

    dispatch({
      payload: { connection },
      type: types.SYSTEM_BUYRAM_PENDING
    });

    const { account } = settings;

    return eos(connection, true).buyrambytes({
      payer: account,
      receiver: account,
      bytes: Number(amount)
    }).then((tx) => {
      setTimeout(dispatch(getAccount(account)), 500);

      return dispatch({
        payload: {
          connection,
          tx
        },
        type: types.SYSTEM_BUYRAM_SUCCESS
      });
    }).catch((err) => dispatch({
      payload: {
        connection,
        err
      },
      type: types.SYSTEM_BUYRAM_FAILURE
    }));
  };
}

export default {
  buyrambytes
};
