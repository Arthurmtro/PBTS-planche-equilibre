import { QueryClient, QueryClientProvider } from "react-query"
import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import "react-toastify/dist/ReactToastify.css"

// Contexts
import CylindersDataProvider from "./contexts/cylindersProdiver"
import RunningProfileProvider from "./contexts/runningProvider"
import ProfilesDataProvider from "./contexts/profilesProvider"
import ThemeProvider from "./contexts/themeProvider"

// Pages
import RunningPage from "./pages/Running"
import HomePage from "./pages/Home"

// Components
import Layout from "./components/Layout"
import ConfigurationPage from "./pages/Configuration"

const queryClient = new QueryClient()

export default function App() {
	return (
		<ThemeProvider>
			<QueryClientProvider client={queryClient}>
				<CylindersDataProvider>
					<ProfilesDataProvider>
						<RunningProfileProvider>
							<ToastContainer
								position="bottom-right"
								autoClose={2000}
								hideProgressBar={false}
								newestOnTop={false}
								closeOnClick
								rtl={false}
								pauseOnFocusLoss
								draggable
								pauseOnHover
								theme="colored"
							/>
							<Layout>
								<Routes>
									<Route path="/" element={<HomePage />} />
									<Route path="/configuration" element={<ConfigurationPage />} />
									<Route path="/running" element={<RunningPage />} />
									<Route
										path="*"
										element={
											<div
												style={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													flexDirection: "column",
												}}>
												<h1>Page not found 404 </h1>
												<img alt="404" src="https://i.pinimg.com/originals/ce/57/77/ce5777bf7b7bd966ef14f4a0c7e4c845.gif" />
											</div>
										}
									/>
								</Routes>
							</Layout>
						</RunningProfileProvider>
					</ProfilesDataProvider>
				</CylindersDataProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}
