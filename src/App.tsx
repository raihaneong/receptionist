import { BrowserRouter, Link, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { FileModule } from './files/FileModule'
import { FileIcon } from './files/FileIcon'
import { ObsidianModule } from './obsidian/ObsidianModule'
import { RaindropModule } from './raindrop/RaindropModule'
import { YoutubeModule } from './youtube/YoutubeModule'
import { AngelpreserverModule } from './angelpreserver/AngelpreserverModule'

function AppLayout() {
  return (
    <div className="site-layout">
      <aside className="site-sidebar" aria-label="Main navigation">
        <Link className="site-brand" to="/">
          <span className="site-brand-mark"><FileIcon name="folder" size={18} /></span>
          <span>Receptionist<span className="site-brand-period">.</span></span>
        </Link>
        <nav className="site-nav">
          <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/obsidian">
            <FileIcon name="file" size={17} />
            <span>obsidian</span>
          </NavLink>
                    <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/angelpreserver">
            <FileIcon name="file" size={17} />
            <span>angelpreserver</span>
          </NavLink>          <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/files">
            <FileIcon name="file" size={17} />
            <span>Files</span>
          </NavLink>          <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/raindrop">
            <FileIcon name="file" size={17} />
            <span>raindrop</span>
          </NavLink>          <NavLink className={({ isActive }) => `site-nav-link${isActive ? ' active' : ''}`} to="/youtube">
            <FileIcon name="file" size={17} />
            <span>youtube</span>
          </NavLink>     
        </nav>
      </aside>
      <main className="site-content">
        <Outlet />
      </main>
    </div>
  )
}

function NotFound() {
  return (
    <section className="site-not-found">
      <h1>Page not found</h1>
      <Link to="/files">Go to files</Link>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={null} />
          <Route path="files" element={<FileModule />} />
          <Route path="angelpreserver" element={<AngelpreserverModule />} />
          <Route path="obsidian" element={<ObsidianModule />} />
          <Route path="raindrop" element={<RaindropModule />} />
          <Route path="youtube" element={<YoutubeModule />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
