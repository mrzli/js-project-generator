import './index.css';
import iconAsset from './assets/icon.svg';
import iconLogo from '/icon.svg';
import { setupCounter } from './counter.ts';

document.querySelector<HTMLDivElement>('#root')!.innerHTML = `
  <div>
    <div class="inline-flex">
      <a href="https://example.org" target="_blank" rel='noreferrer'>
        <img src="${iconLogo}" class="icon" alt="Icon" style="width: 64px; height: 64px" />
      </a>
      <a href="https://example.org" target="_blank" rel='noreferrer'>
        <img src="${iconAsset}" class="icon" alt="Asset" style="width: 64px; height: 64px" />
      </a>
    </div>
    <h1>Vite + TypeScript</h1>
    <div class>
      <button id="counter" type="button" class="bg-gray-300 m-2 px-3 py-1 rounded"></button>
    </div>
    <p class="read-the-docs">
      Click one of the logos to navigate to example.org
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);
