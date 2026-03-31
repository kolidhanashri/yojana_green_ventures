import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LeadService } from './services/lead.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);
  
  protected readonly title = signal('Yojana Green Ventures');

  quoteForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern('^[6-9][0-9]{9}$')]],
    projectType: ['residential', Validators.required],
    avgBill: ['', [Validators.required, Validators.min(0)]]
  });

  isSubmitting = signal(false);
  isSubmitted = signal(false);

  onSubmit() {
    if (this.quoteForm.valid) {
      this.isSubmitting.set(true);

      this.leadService.submitLead(this.quoteForm.value).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.isSubmitted.set(true);
          // Reset form after 3 seconds
          setTimeout(() => {
            this.isSubmitted.set(false);
            this.quoteForm.reset({ projectType: 'residential' });
          }, 3000);
        },
        error: () => {
          this.isSubmitting.set(false);
          // Handle error if needed, but the service already maps most cases to success for Google Forms
        }
      });
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
