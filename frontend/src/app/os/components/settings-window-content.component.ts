import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-window-content',
  templateUrl: './settings-window-content.component.html',
  styleUrls: ['./settings-window-content.component.css']
})
export class SettingsWindowContentComponent {
  settings = [
    { category: 'System', icon: '⚙️', items: ['Display', 'Sound', 'Power'] },
    { category: 'Personalization', icon: '🎨', items: ['Background', 'Colors', 'Themes'] },
    { category: 'Privacy', icon: '🔒', items: ['Location', 'Camera', 'Microphone'] },
    { category: 'Accounts', icon: '👤', items: ['Your Account', 'Family', 'Sync'] }
  ];

  selectedCategory: string | null = null;

  getSelectedCategoryItems(): string[] {
    const category = this.settings.find(s => s.category === this.selectedCategory);
    return category ? category.items : [];
  }
}

