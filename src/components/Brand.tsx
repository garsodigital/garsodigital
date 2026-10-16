import { site } from '../config/site';

export function Brand() {
  return <a className="brand" href="#inicio" aria-label="Garso Digital — início">
    {site.logo ? <img src={site.logo} alt="Garso Digital" width="150" height="44" /> :
      <span className="brand-name">garso<span className="brand-digital">DIGITAL</span></span>}
  </a>;
}
