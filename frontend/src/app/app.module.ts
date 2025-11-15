import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

// OS Components
import { OSDesktopComponent } from './os/components/os-desktop.component';
import { WindowComponent } from './os/components/window.component';
import { StartMenuComponent } from './os/components/start-menu.component';
import { DesktopIconComponent } from './os/components/desktop-icon.component';
import { HelpWindowContentComponent } from './os/components/help-window-content.component';
import { EncodeWindowContentComponent } from './os/components/encode-window-content.component';
import { DecodeWindowContentComponent } from './os/components/decode-window-content.component';
import { FilesWindowContentComponent } from './os/components/files-window-content.component';
import { SettingsWindowContentComponent } from './os/components/settings-window-content.component';
import { BrowserWindowContentComponent } from './os/components/browser-window-content.component';
import { TopBarComponent } from './os/components/top-bar.component';
import { TaskbarComponent } from './os/components/taskbar.component';
import { ContextMenuComponent } from './os/components/context-menu.component';
import { NoteWindowContentComponent } from './os/components/note-window-content.component';
import { MenuBarComponent } from './os/components/menu-bar.component';
import { TutorialOverlayComponent } from './os/components/tutorial-overlay.component';
import { SafeUrlPipe } from './os/pipes/safe-url.pipe';

@NgModule({
  declarations: [
    AppComponent,
    OSDesktopComponent,
    WindowComponent,
    StartMenuComponent,
    DesktopIconComponent,
    HelpWindowContentComponent,
    EncodeWindowContentComponent,
    DecodeWindowContentComponent,
    FilesWindowContentComponent,
    SettingsWindowContentComponent,
    BrowserWindowContentComponent,
    TopBarComponent,
    TaskbarComponent,
    ContextMenuComponent,
    NoteWindowContentComponent,
    MenuBarComponent,
    TutorialOverlayComponent,
    SafeUrlPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
