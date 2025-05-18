import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../core/services/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Component, Input } from '@angular/core';

// Create mock components to avoid RouterLink issues
@Component({
  selector: 'app-navbar',
  template: '<div>Mock Navbar</div>',
  standalone: true
})
class MockNavbarComponent {
  @Input() username: string = '';
}

@Component({
  selector: 'app-sidebar',
  template: '<div>Mock Sidebar</div>',
  standalone: true
})
class MockSidebarComponent {}

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser'], {
      currentUser$: of({ name: 'Test User' })  // Mock the currentUser$ observable
    });
    authSpy.getCurrentUser.and.returnValue({ name: 'Test User' });

    await TestBed.configureTestingModule({
      imports: [
        MainLayoutComponent,
        MockNavbarComponent,
        MockSidebarComponent,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
