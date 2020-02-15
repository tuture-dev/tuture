const initialState = {
  isEditing: false,
  text: '',
  url: '',
};

const linkActionTypes = {
  START_EDIT: 'start_edit',
  FINISH_EDIT: 'finish_edit',
  UPDATE_TEXT: 'update_text',
  UPDATE_URL: 'update_url',
  CANCEL_EDIT: 'cancel_edit',
};

export const startEditLink = () => ({ type: linkActionTypes.START_EDIT });

export const finishEditLink = () => ({ type: linkActionTypes.FINISH_EDIT });

export const cancelEditLink = () => ({ type: linkActionTypes.CANCEL_EDIT });

export const updateLinkText = (text) => ({
  type: linkActionTypes.UPDATE_TEXT,
  text,
});

export const updateLinkUrl = (url) => ({
  type: linkActionTypes.UPDATE_URL,
  url,
});

export const linkReducer = (state, action) => {
  switch (action.type) {
    case linkActionTypes.START_EDIT:
      return { ...state, isEditing: true };
    case linkActionTypes.FINISH_EDIT:
      return { ...initialState };
    case linkActionTypes.UPDATE_TEXT:
      return { ...state, text: action.text };
    case linkActionTypes.UPDATE_URL:
      return { ...state, url: action.url };
    case linkActionTypes.CANCEL_EDIT:
      return {
        ...state,
        isEditing: false,
        url: '',
        text: '',
      };
    default:
      return state;
  }
};
