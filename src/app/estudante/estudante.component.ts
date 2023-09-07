import { EstudanteService } from './../estudante.service'; 
import { Component, OnInit } from '@angular/core';
import { Estudante } from '../estudante';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-estudante', 
  templateUrl: './estudante.component.html',
  styleUrls: ['./estudante.component.css']
})
export class EstudanteComponent implements OnInit {

  estudantes: Estudante[] = []; 
  isEditing: boolean = false;
  formGroupEstudante: FormGroup; 
  submitted: boolean = false;

  constructor(private estudanteService: EstudanteService, 
    private formBuilder: FormBuilder) {
      this.formGroupEstudante = formBuilder.group({ 
        id: [''],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        rg: ['', [Validators.required]],
        telefone: ['', [Validators.required]]
      });
  }

  ngOnInit(): void {
    this.loadEstudantes();
  }

  loadEstudantes() {
    this.estudanteService.getEstudantes().subscribe(
      {
        next: data => this.estudantes = data
      }
    )
  }

  save() {
    this.submitted = true;
    if (this.formGroupEstudante.valid)
    if (this.isEditing) {
      this.estudanteService.update(this.formGroupEstudante.value).subscribe(
      {
        next: () => {
          this.loadEstudantes();
          this.formGroupEstudante.reset();
          this.isEditing = false;
          this.submitted = false;
        }
      }
      )
    } else {
      this.estudanteService.save(this.formGroupEstudante.value).subscribe(
        {
          next: data => {
            this.estudantes.push(data);
            this.formGroupEstudante.reset();
          }
        }
      )
    }
  }

  clean (){
    this.formGroupEstudante.reset();
    this.isEditing = false;
    this.submitted = false;
  }

  edit(estudante : Estudante){
    this.formGroupEstudante.setValue(estudante);
    this.isEditing = true;
  }

  delete(estudante: Estudante){
    this.estudanteService.delete(estudante).subscribe({
      next: () => this.loadEstudantes()
    })
  }

  get name() : any{
    return this.formGroupEstudante.get("name");
  }

  get email() : any{
    return this.formGroupEstudante.get("email");
  }

  get rg() : any{
    return this.formGroupEstudante.get("rg");
  }

  get telefone() : any{
    return this.formGroupEstudante.get("telefone");
  }
}
