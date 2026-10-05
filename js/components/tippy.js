// Подсказки, созданные для каждого контейнера: при перерисовке списка старые нужно удалять
const instancesByRoot = new WeakMap();

export function initTippy(root = document) {
  if (typeof tippy !== 'function') return;

  instancesByRoot.get(root)?.forEach((instance) => instance.destroy());

  const instances = [];

  root.querySelectorAll('.tooltip__btn').forEach((btn) => {
    const content = btn.nextElementSibling;

    if (!content) return;

    instances.push(
      tippy(btn, {
        content: content.innerHTML,
        allowHTML: true,
        theme: 'lightwhite',
        placement: 'top',
      })
    );
  });

  instancesByRoot.set(root, instances);
}
