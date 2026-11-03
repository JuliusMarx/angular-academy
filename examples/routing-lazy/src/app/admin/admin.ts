import { Component } from '@angular/core';

// Runs once, when this file is loaded – i.e. on the first visit to /admin.
console.log('📦 admin chunk loaded');

@Component({
  selector: 'app-admin',
  template: `<h1>Admin</h1><p>This component lives in its own JavaScript file.</p>`,
})
export class Admin {}
