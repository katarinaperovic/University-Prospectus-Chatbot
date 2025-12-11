import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './routes/router'


function App() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: error => {
        console.log(error)
      }
    })
  })


  return (
    <QueryClientProvider client={queryClient}>
        <Router/>
      
    </QueryClientProvider>
  )
}

export default App
