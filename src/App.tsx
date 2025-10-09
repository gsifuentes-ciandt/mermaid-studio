import { type ReactElement } from 'react';
import { Toaster } from 'react-hot-toast';
import { Layout } from './components/layout/Layout';
import { Header } from './components/layout/Header';
import { DiagramGrid } from './components/diagram/DiagramGrid';
import { SearchFilterBar } from './components/layout/SearchFilterBar';
import { Toolbar } from './components/layout/Toolbar';
import { DiagramModal } from './components/modals/DiagramModal';
import { InfoModal } from './components/modals/InfoModal';
import { ZoomModal } from './components/zoom/ZoomModal';

function App(): ReactElement {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <Header />
        <Toolbar />
        <SearchFilterBar />
        <DiagramGrid />
      </div>
      <DiagramModal />
      <InfoModal />
      <ZoomModal />
      <Toaster position="top-center" gutter={12} />
    </Layout>
  );
}

export default App;
