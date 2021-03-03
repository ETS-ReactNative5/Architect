/* eslint-disable no-param-reassign,no-restricted-syntax */
import { Transforms, Node, Element } from 'slate';

const defaultOptions = {
  multiline: true,
};

const withNormalize = (editor, userOptions) => {
  const { normalizeNode } = editor;
  const options = { ...defaultOptions, ...userOptions };

  console.log({ options });

  editor.normalizeNode = ([node, path]) => {
    if (options.multiline === false) {
      if (path.length === 0) { // for top level path only
        // If empty, insert a blank paragraph node
        if (editor.children.length < 1) {
          const defaultNode = { type: 'paragraph', children: [{ text: '' }] };
          Transforms.insertNodes(editor, defaultNode, { at: path.concat(0) });
        }

        // Force the first node to always be a paragraph and merge any
        // later nodes
        for (const [child, childPath] of Node.children(editor, path)) {
          if (Element.isElement(child) && childPath[0] === 0) {
            Transforms.setNodes(
              editor,
              { type: 'paragraph', break: false },
              { at: childPath },
            );
          } else if (Element.isElement(child)) {
            Transforms.mergeNodes(editor, { at: childPath });
          }
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
};

export default withNormalize;
