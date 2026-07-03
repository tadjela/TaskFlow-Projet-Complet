<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'priority' => $this->priority,
            'status' => $this->status,
            'deadline' => $this->deadline?->toDateString(),
            'is_overdue' => $this->deadline
                && $this->deadline->isPast()
                && $this->status !== 'terminee',
            'category' => $this->whenLoaded('category', fn () => $this->category ? new CategoryResource($this->category) : null),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
