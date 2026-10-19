
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LocationSearch from '../components/LocationSearch'
import { useTrip } from '../hooks/useTrip'
import { vehiclesApi } from '../services/api'
import type { Vehicle } from '../types'
import { VEHICLE_FUEL_LABEL } from '../utils/format'

export default function HomePage() {
  const navigate = useNavigate()
  const { sourceLoc, destLoc, sourceText, destText, setSource, setDest, vehicle, setVehicle } = useTrip()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    vehiclesApi.list().then(setVehicles).catch(e => setLoadError(e.message))
  }, [])

  const canPlan = !!(sourceLoc && destLoc && vehicle)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-white">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-wide text-blue-700">OptiNav</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-600">
          <Link to="/vehicles" className="hover:text-blue-700 transition-colors">Vehicles</Link>
          <Link to="/planner" className="hover:text-blue-700 transition-colors">Planner</Link>
        </nav>
      </header>

      <main>
        <div className="max-w-5xl mx-auto px-6 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-2 text-sm text-blue-700 mb-8">
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
            SMART VEHICLE NAVIGATION
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight text-slate-900">
            Navigate smarter.<br />
            <span className="text-blue-600">Travel farther.</span>
          </h1>

          <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Plan efficient journeys across India with vehicle-aware routes, fuel estimates, and EV charging stops.
          </p>

          <div className="bg-white border border-blue-100 rounded-2xl p-6 md:p-8 text-left shadow-xl shadow-blue-100/50 max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-slate-900 mb-5">Plan your journey</h2>

            <div className="space-y-4 mb-5">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">From</label>
                <LocationSearch
                  placeholder="Starting city or address…"
                  value={sourceText}
                  selected={sourceLoc}
                  onTextChange={t => setSource(null, t)}
                  onSelect={loc => setSource(loc, loc.label)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">To</label>
                <LocationSearch
                  placeholder="Destination city or address…"
                  value={destText}
                  selected={destLoc}
                  onTextChange={t => setDest(null, t)}
                  onSelect={loc => setDest(loc, loc.label)}
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2 block">Vehicle</label>
              <select
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={vehicle?.id ?? ''}
                onChange={e => setVehicle(vehicles.find(v => v.id === Number(e.target.value)) ?? null)}
              >
                <option value="">Select your vehicle…</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} — {VEHICLE_FUEL_LABEL[v.fuel_type] ?? v.fuel_type}
                  </option>
                ))}
              </select>

              {loadError && <p className="text-xs text-red-600 mt-2">{loadError}</p>}

              {!loadError && vehicles.length === 0 && (
                <p className="text-xs text-slate-500 mt-2">
                  No vehicles yet — <Link to="/vehicles" className="text-blue-700 underline">add one</Link>.
                </p>
              )}
            </div>

            <button
              onClick={() => canPlan && navigate('/planner')}
              disabled={!canPlan}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors text-lg"
            >
              {canPlan ? 'Plan My Trip →' : !sourceLoc || !destLoc ? 'Select start and destination' : 'Select a vehicle'}
            </button>
          </div>
        </div>

        <section className="bg-blue-50/70 border-t border-blue-100">
          <div className="max-w-5xl mx-auto px-6 py-12 md:py-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Everything you need for the journey</h2>
              <p className="text-slate-600 mt-2">Smarter planning for different vehicles and energy types.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '⛽', title: 'Multi-Fuel', desc: 'Petrol, Diesel, CNG, Bi-fuel' },
                { icon: '⚡', title: 'EV Support', desc: 'Charging stops & charge time' },
                { icon: '🗺️', title: 'Real Facilities', desc: 'OpenStreetMap data along your route' },
                { icon: '💰', title: 'Honest Costs', desc: 'Consumption-based, no fake savings' },
              ].map(f => (
                <div key={f.title} className="bg-white border border-blue-100 rounded-xl p-5 text-center shadow-sm">
                  <div className="text-3xl mb-3">{f.icon}</div>
                  <div className="font-semibold text-sm text-slate-900">{f.title}</div>
                  <div className="text-slate-600 text-xs mt-2 leading-relaxed">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
