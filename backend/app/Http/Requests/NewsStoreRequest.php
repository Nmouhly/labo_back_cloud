<?php
 
namespace App\Http\Requests;
 
use Illuminate\Foundation\Http\FormRequest;
 
class NewsStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        //return false;
        return true;
    }
 
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        if(request()->isMethod('post')) {
            return [
                'title' => 'required|string|max:258',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'content' => 'required|string'
            ];
        } else {
            return [
                'title' => 'required|string|max:258',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'content' => 'required|string'
            ];
        }
    }
  
    public function messages()
    {
        if(request()->isMethod('post')) {
            return [
                'title.required' => 'title is required!',
                'image.required' => 'Image is required!',
                'content.required' => 'content is required!'
            ];
        } else {
            return [
                'title.required' => 'title is required!',
                'content.required' => 'content is required!'
            ];   
        }
    }
}