// Prepares the test environment – what `ng test` does for you in a real project.
import { TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { installGlobals } from './mini-test';

installGlobals();
TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
