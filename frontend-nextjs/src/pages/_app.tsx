import { MindmapProvider } from '../context/MindmapContext'
import '../styles/global.scss'

function MyApp({ Component, pageProps }) {
  return (
    <MindmapProvider>
      <Component {...pageProps} />
    </MindmapProvider>
  )
  //<Component {...pageProps} />
}

export default MyApp
