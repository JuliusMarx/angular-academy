import { Component } from '@angular/core';
import { FileSizePipe } from './file-size.pipe';

@Component({
  selector: 'app-root',
  imports: [FileSizePipe],
  template: `
    <h1>Downloads</h1>
    <table>
      @for (file of files; track file.name; let i = $index) {
        <tr>
          <td>{{ file.name }}</td>
          <td [id]="'size-' + i">{{ file.bytes | fileSize }}</td>
        </tr>
      }
    </table>
  `,
})
export class App {
  protected readonly files = [
    { name: 'notes.txt', bytes: 512 },
    { name: 'logo.png', bytes: 1536 },
    { name: 'exact.bin', bytes: 1024 },
    { name: 'video.mp4', bytes: 1048576 },
    { name: 'backup.zip', bytes: 1610612736 },
  ];
}
