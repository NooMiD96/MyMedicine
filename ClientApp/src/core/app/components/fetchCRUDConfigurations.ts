import { XPT } from 'core/app/reducer';

const fetchGetConfig = (xpt?: XPT) => <RequestInit>{
  method: 'GET',
  credentials: 'same-origin',
  ...(
    xpt && xpt.__xpt_header_name && xpt.__xpt_request
      ? { headers: { [xpt.__xpt_header_name]: xpt.__xpt_request } }
      : {}
  ),
};

const fetchPostConfig = (xpt: XPT, body: any) => <RequestInit>{
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    ...(xpt.__xpt_header_name && xpt.__xpt_request
      ? { [xpt.__xpt_header_name]: xpt.__xpt_request }
      : {}
    ),
  },
  body,
};

const fetchDeleteConfig = (xpt: XPT, body?: any) => <RequestInit>{
  method: 'DELETE',
  credentials: 'same-origin',
  ...(
    xpt.__xpt_header_name && xpt.__xpt_request
      ? { [xpt.__xpt_header_name]: xpt.__xpt_request }
      : {}
  ),
  ...(
    body ? { body: body } : {}
  ),
};

const fetchPatchConfig = (xpt: XPT, body: any) => <RequestInit>{
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    ...(xpt.__xpt_header_name && xpt.__xpt_request
      ? { [xpt.__xpt_header_name]: xpt.__xpt_request }
      : {}
    ),
  },
  body,
};

export {
  fetchGetConfig,
  fetchPostConfig,
  fetchDeleteConfig,
  fetchPatchConfig,
};
