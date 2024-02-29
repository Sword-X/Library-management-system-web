const ApiConst = {
    // 用户管理
    user: {
        // 分页查询
        getPage: '/api/lms/user/getPage',
        // 用户新增
        save: '/api/lms/user/save',
        // 用户删除
        delete: '/api/lms/user/delete',
        // 用户登录
        login: '/api/lms/user/login',
        // 用户退出
        logout: '/api/lms/user/logout',
        // 根据用户查询角色
        getRoleListByUserId: '/api/lms/user/getRoleListByUserId',
        // 根据用户分配角色
        saveAssignRole: '/api/lms/user/saveAssignRole'
    },
    // 角色管理
    role: {
        // 分页
        getPage: '/api/lms/role/getPage',
        // 新增
        save: '/api/lms/role/save',
        // 删除
        delete: '/api/lms/role/delete',
        // 根据角色查询菜单
        getMenuListByRoleId: '/api/lms/role/getMenuListByRoleId',
        // 根据角色分配菜单
        saveAssignMenu: '/api/lms/role/saveAssignMenu',
        // 根据角色获取用户
        getIncludUsers: '/api/lms/role/getIncludUsers',
        // 删除包含的用户
        deleteIncludUser: '/api/lms/role/deleteIncludUser'
    },
    // 菜单管理
    menu: {
        // 分页
        getPage: '/api/lms/menu/getPage',
        // 新增
        save: '/api/lms/menu/save',
        // 删除
        delete: '/api/lms/menu/delete',
    },
    // 菜单管理
    log: {
        // 分页
        getPage: '/api/lms/log/getPage'
    },
    // 接口信息管理
    api: {
        // 分页
        getPage: '/api/lms/api/getPage',
        // 新增
        save: '/api/lms/api/save',
        // 删除
        delete: '/api/lms/api/delete',
    },
    // 藏书阁管理
    bookStore: {
        // 分页
        getPage: '/api/lms/bookStore/getPage',
        // 新增
        save: '/api/lms/bookStore/save',
        // 删除
        delete: '/api/lms/bookStore/delete',
    },
    // 借阅信息
    brrow: {
        // 分页
        getPage: '/api/lms/brrow/getPage',
        // 新增
        save: '/api/lms/brrow/save',
        // 删除
        delete: '/api/lms/brrow/delete',
    },
    // 图书分类管理
    bookCategory: {
        // 分页
        getPage: '/api/lms/bookCategory/getPage',
        // 新增
        save: '/api/lms/bookCategory/save',
        // 删除
        delete: '/api/lms/bookCategory/delete',
    },

}

export default ApiConst;