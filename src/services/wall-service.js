import httpService from './http-service';
import endpoints from '../endpoints';

const WallService = {
  saveFolderPost: async params => {
    const {
      WALL: { SAVE_FOLDER_POST },
    } = endpoints;

    const response = await httpService.post(SAVE_FOLDER_POST, {
      data: params,
      showAlertIfError: true,
      alertMsgIfSuccess: 'alert.success.wall.post-saved',
    });

    return response;
  },
  updateInactivePost: async ({ idPost, tipoDestinatarios }) => {
    const {
      WALL: { UPDATE_INACTIVE_POST },
    } = endpoints;

    const response = await httpService.put(UPDATE_INACTIVE_POST, {
      urlParams: { idPost, tipoDestinatarios },
      showAlertIfError: true,
      alertMsgIfSuccess: 'alert.success.wall.post-deleted',
    });

    return response;
  },
  deleteFolderPost: async ({ postId, folderId, tipoDestinatarios }) => {
    const {
      WALL: { DELETE_FOLDER_POST },
    } = endpoints;

    const response = await httpService.delete(DELETE_FOLDER_POST, {
      urlParams: { postId, folderId, tipoDestinatarios },
      showAlertIfError: true,
      alertMsgIfSuccess: 'alert.success.wall.post-removed',
    });

    return response;
  },
  getPosts: async ({
    dateFrom,
    dateTo,
    sender,
    showUnread,
    feedSelected,
    folderId,
    searchText,
    numPostsLoaded,
  }) => {
    const {
      WALL: { GET_POSTS },
    } = endpoints;

    const response = await httpService.get(GET_POSTS, {
      queryParams: {
        dateFrom,
        dateTo,
        sender,
        showUnread,
        feedSelected,
        folderId,
        searchText,
        numPostsLoaded,
      },
      defaultValueError: { nrPostsNaoLidos: null, nrTotalRascunhos: null, lstPosts: [] },
    });

    return response;
  },
};

export default WallService;
