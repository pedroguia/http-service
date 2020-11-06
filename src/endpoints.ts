const endpoints = {
  WALL: {
    SAVE_FOLDER_POST: "/api/Wall/postFolderPost",
    UPDATE_INACTIVE_POST:
      "/api/Wall/putInactivePost/:idPost:/:tipoDestinatarios:",
    DELETE_FOLDER_POST:
      "/api/Wall/deleteFolderPost/:postId:/:folderId:/:tipoDestinatarios:",
    GET_POSTS: "/api/Wall/getPosts",
  },
};

export default endpoints;
