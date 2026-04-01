

const componentRegistry = {
    Button: {
        id: 'button',
        component: require('../components/ui/button').default,
        defaultProps: {
            label: 'Button',
            style: 'bg-blue-500 text-white px-4 py-2 rounded',
        },
    },
    Text: {
        id: 'text',
        component: require('../components/reactbits/BlurText').default,
        defaultProps: {
            content: 'Editable Text',
            style: 'text-lg font-medium',
        },
    },
    Image: {
        id: 'image',
        component: 'img',
        defaultProps: {
            src: 'https://via.placeholder.com/150',
            alt: 'Placeholder Image',
            style: 'w-full h-auto',
        },
    },
    Section: {
        id: 'section',
        component: 'div',
        defaultProps: {
            style: 'p-4 border border-gray-300 rounded',
        },
    },
};

export default componentRegistry;