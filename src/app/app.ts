import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private fb = inject(FormBuilder);
  
  protected readonly title = signal('Yojana Green Ventures');

  quoteForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
    projectType: ['residential', Validators.required],
    avgBill: ['', [Validators.required, Validators.min(0)]],
    message: ['']
  });

  isSubmitted = signal(false);

  onSubmit() {
    if (this.quoteForm.valid) {
      console.log('Form Submitted:', this.quoteForm.value);
      this.isSubmitted.set(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        this.isSubmitted.set(false);
        this.quoteForm.reset({ projectType: 'residential' });
      }, 3000);
    } else {
      Object.keys(this.quoteForm.controls).forEach(key => {
        const control = this.quoteForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
