const SideBarMenu = require('../models/SideBarMenu');

exports.getFlattenedMenuList = async () => {
  const items = await SideBarMenu.find({}).lean();

  const titles = items
    .filter(i => i.type === 'menu-title')
    .sort((a, b) => (a.module_priority || 0) - (b.module_priority || 0));

  const grouped = titles.map(title => {
    const children = items
      .filter(i => i.type !== 'menu-title' && i.parent_module_id === title.module_id)
      .sort((a, b) => (a.module_menu_priority || 0) - (b.module_menu_priority || 0));
    return { ...title, children };
  });

  const flattened = [];
  grouped.forEach(group => {
    flattened.push({ ...group });
    group.children.forEach(child => {
      flattened.push(child);
    });
  });

  return flattened;
};
