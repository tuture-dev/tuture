/**
 * Common Status constants
 */
export const NORMAL = 'NORMAL';
export const SUCCESS = 'SUCCESS';
export const ERROR = 'ERROR';

/**
 * Get Data Status constants
 */
export const LOADING = 'LOADING';
export const LOADING_SUCCESS = 'LOADING_SUCCESS';
export const LOADING_ERROR = 'LOADING_ERROR';

/**
 * commit Status constants
 */
export const COMMIT = 'COMMIT';
export const COMMIT_SUCCESS = 'COMMIT_SUCCESS';
export const COMMIT_ERROR = 'COMMIT_ERROR';

/**
 * Open drawer type constants
 */
export const DRAWER_UNSELECT = 'DRAWER_UNSELECT';
export const PAGE_CATAGUE = 'PAGE_CATAGUE';
export const COLLECTION_CATALOGUE = 'COLLECTION_CATALOGUE';
export const COLLECTION_SETTING = 'COLLECTION_SETTING';
export const CONTACT_US = 'CONTACT_US';

/**
 * Open children drawer type constants
 *
 */
export const CREATE_ARTICLE = 'CREATE_ARTICLE';
export const EDIT_ARTICLE = 'EDIT_ARTICLE';

/**
 *  breakpoint type constants
 *
 */
export const XS = 'XS';
export const SM = 'SM';
export const MD = 'MD';
export const LG = 'LG';
export const XL = 'XL';
export const XXL = 'XXL';

/**
 *  Explain type constants
 *
 */
export const STEP_PRE_EXPLAIN = 'STEP_PRE_EXPLAIN';
export const STEP_POST_EXPLAIN = 'STEP_POST_EXPLAIN';
export const DIFF_PRE_EXPLAIN = 'DIFF_PRE_EXPLAIN';
export const DIFF_POST_EXPLAIN = 'DIFF_POST_EXPLAIN';

/**
 * Additional block types.
 */
export const STEP = 'step';
export const FILE = 'file';
export const EXPLAIN = 'explain';
export const DIFF_BLOCK = 'diff-block';

/**
 * empty  bound types.
 */
export const STEP_START = 'step_start';
export const STEP_END = 'step_end';
export const FILE_START = 'file_start';
export const FILE_END = 'file_end';
export const NOW_STEP_START = 'now_step_start';

/**
 * sync constants
 */
export const NO_REMOTE_GITHUB = 'NO_REMOTE_GITHUB';

/**
 * sync exit code
 */
export enum EXIT_CODE {
  NOT_INIT = 1,
  NO_STAGE,
  NO_REMOTE,
  CONFLICT,
}

export const mapExitCodeToMessage = {
  [EXIT_CODE.NOT_INIT]: '你的 GIT 仓库还没有初始化成 Tuture 教程',
  [EXIT_CODE.NO_STAGE]: '你的 GIT 仓库还没有任何提交',
  [EXIT_CODE.NO_REMOTE]: '你的 GIT 仓库还没有设置远程仓库，无法进行同步',
  [EXIT_CODE.CONFLICT]:
    '你的 GIT 仓库在与远程仓库同步时存在冲突，请手动解决冲突',
};
