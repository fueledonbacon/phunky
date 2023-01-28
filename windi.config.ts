import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
  attributify: {
    prefix: 'cls'
  },
  theme: {
    extend: {
      backgroundImage: {
        hero: 'linear-gradient(#0006, #0006), url(/images/mushroom-bg.jpg)',
        'phunky-fungi': 'url(/images/phunky-fungi-bg.jpg)',
        'go-legendary': 'url(/images/go-legendary-bg.jpg)',
        'mutant-mushie': 'url(/images/mutant-mushie-bg.jpg)',
        'rainbow-bar': 'url(/images/rainbow-bar.svg)',
        'staking-game': 'url(/images/staking-game-bg.svg)',
        'staking-game-tablet': 'url(/images/staking-game-tablet-bg.svg)',
        'staking-game-mobile': 'url(/images/staking-game-mobile-bg.svg)',
        premium: 'url(/images/premium-bg.jpg)',
        about: 'url(/images/about-bg.jpg)',
        faq: 'url(/images/faq-bg.jpg)',
        stake: 'url(/images/stake-bg.jpg)'
      },
      colors: {
        primary: '#FAB721',
        secondary: '#189CD7',
        tertiary: '#933E97',
        accent: '#F38320',
        positive: '#63B945',
        negative: '#DF3940',
        grey: '#C1C1C1',
        dark: '#333333'
      },
      fontFamily: {
        davida: ['DAVIDA BD BT', 'sans-serif'],
        lato: ['Lato', 'sans-serif']
      }
    }
  },
  shortcuts: {
    'bg-normal': 'bg-no-repeat bg-center bg-cover',
    header: 'fixed top-0 left-0 right-0 flex items-center h-16 md:h-24 bg-black px-10 py-6 z-50',
    btn: 'inline-flex items-center font-extrabold border rounded-full px-12 py-4',
    'btn--primary': 'bg-black text-primary border-primary',
    'btn--secondary': 'bg-white text-secondary border-secondary',
    'btn--accent': 'bg-black text-accent border-accent',
    button: {
      '@apply': 'relative text-primary rounded-full font-bold outline-none border-2 border-primary duration-300',
      '&-menu': {
        '@apply': 'absolute top-1/1 left-0 right-0 pt-2',
        '&__contents': { '@apply': 'bg-white text-neutral-500 font-normal border border-neutral-300 rounded-lg py-1' },
        '&__option': {
          '@apply': 'hover:bg-primary/10 first-letter:uppercase p-2',
          '&--active': { '@apply': 'bg-primary/15' }
        }
      }
    },
    fab: 'inline-flex items-center justify-center w-12 h-12 border rounded-full',
    section: 'px-4 md:px-12 xl:px-20 py-16 xl:py-24',
    'flex-center': 'items-center justify-center',
    'fixed-screen': 'fixed top-0 left-0 right-0 bottom-0'
  }
})
