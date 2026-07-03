<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TaskRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $method = $this->method();

        return [
            'title' => [$method === 'POST' ? 'required' : 'sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['sometimes', 'in:basse,moyenne,haute'],
            'status' => ['sometimes', 'in:a_faire,en_cours,terminee'],
            'deadline' => ['nullable', 'date'],
            'category_id' => ['nullable', 'exists:categories,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Le titre est obligatoire.',
            'priority.in' => 'La priorité doit être basse, moyenne ou haute.',
            'status.in' => 'Le statut doit être à faire, en cours ou terminée.',
            'category_id.exists' => "La catégorie sélectionnée n'existe pas.",
        ];
    }
}
