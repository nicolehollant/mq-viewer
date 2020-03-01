module.exports = {
  theme: {
    extend: {
      width: {
        max: 'max-content',
        min: 'min-content',
      },
      height: {
        max: 'max-content',
        min: 'min-content',
      },
      colors: {
        focus: 'var(--system-purple)',
        sys: {
          'text': 'var(--system-text)',
          '1': 'var(--system-gray-1)',
          '2': 'var(--system-gray-2)',
          '3': 'var(--system-gray-3)',
          '4': 'var(--system-gray-4)',
          '5': 'var(--system-gray-5)',
          '6': 'var(--system-gray-6)',
          '7': 'var(--system-gray-7)',
          'blue': 'var(--system-blue)',
          'green': 'var(--system-green)',
          'indigo': 'var(--system-indigo)',
          'orange': 'var(--system-orange)',
          'pink': 'var(--system-pink)',
          'purple': 'var(--system-purple)',
          'red': 'var(--system-red)',
          'teal': 'var(--system-teal)',
          'yellow': 'var(--system-yellow)',
        }
      }
    },
  },
  variants: {},
  plugins: [
    // transition 
    function({ addUtilities }) {
      const utils = {}
      const curves = ['', '-in', '-out', '-in-out']
      for(const curve of curves) {
        utils[`.ease${curve}-slow`] = { "transition": `1s ease${curve}` };
        utils[`.ease${curve}`] = { "transition": `0.3s ease${curve}` };
        utils[`.ease${curve}-fast`] = { "transition": `0.1s ease${curve}` };
      }
      addUtilities(utils)
    },
    // flex
    function({ addUtilities }) {
      const utils = {
        '.flex-center': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.flex-col-center': {
          'display': 'flex',
          'align-items': 'center',
          'justify-content': 'center',
          'flex-direction': 'column',
        },
      }
      addUtilities(utils)
    }

  ],
}
