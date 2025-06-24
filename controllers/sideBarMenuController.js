const sideBarMenuService = require('../services/sideBarMenu.service');

exports.list = async (req, res) => {
  try {
    const menuList = await sideBarMenuService.getFlattenedMenuList();
    res.json(menuList);
  } catch (err) {
    console.error('listMenus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
