import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DbGate } from '@/hooks/useVtcData';
import { FormulasPage } from '@/pages/FormulasPage';
import { JarabesPage } from '@/pages/JarabesPage';
import { VtcPage } from '@/pages/VtcPage';

export default function App() {
  return (
    <DbGate>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<VtcPage />} />
            <Route path="/formulas" element={<FormulasPage />} />
            <Route path="/jarabes" element={<JarabesPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </DbGate>
  );
}
