"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Upload, Plus } from "lucide-react"
import { useCreatePost } from "@/hooks/use-posts-query"

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const createPostMutation = useCreatePost()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    skillLevel: "",
    duration: "",
    isExchange: true,
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")

  const categories = ["Arte", "Tecnologia", "Música", "Idiomas", "Culinária", "Design", "Negócios"]
  const skillLevels = ["Iniciante", "Intermediário", "Avançado"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const postData = {
      title: formData.title,
      body: formData.description,
      userId: 1, // Mock user ID
    }

    createPostMutation.mutate(postData, {
      onSuccess: () => {
        onClose()
        // Reset form
        setFormData({
          title: "",
          description: "",
          category: "",
          skillLevel: "",
          duration: "",
          isExchange: true,
          tags: [],
        })
        setNewTag("")
      }
    })
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cyan-400">Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-slate-300">Cover Image</Label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-cyan-400/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">Click to upload or drag and drop</p>
              <p className="text-slate-500 text-xs mt-1">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter your skill title..."
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Describe what you'll teach and what students will learn..."
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
              required
            />
          </div>

          {/* Category and Skill Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-slate-600">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Skill Level *</Label>
              <Select
                value={formData.skillLevel}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, skillLevel: value }))}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  {skillLevels.map((level) => (
                    <SelectItem key={level} value={level} className="text-white hover:bg-slate-600">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration" className="text-slate-300">
              Duration *
            </Label>
            <Input
              id="duration"
              placeholder="e.g., 2 hours, 30 minutes"
              value={formData.duration}
              onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label className="text-slate-300">Tags</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-slate-700 border-slate-600 text-white flex-1"
              />
              <Button type="button" onClick={addTag} size="sm" className="bg-cyan-400 hover:bg-cyan-500 text-slate-900">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Exchange Toggle */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isExchange"
              checked={formData.isExchange}
              onChange={(e) => setFormData((prev) => ({ ...prev, isExchange: e.target.checked }))}
              className="w-4 h-4 text-cyan-400 bg-slate-700 border-slate-600 rounded focus:ring-cyan-400"
            />
            <Label htmlFor="isExchange" className="text-slate-300">
              This is a skill exchange (I want to learn something in return)
            </Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPostMutation.isPending || !formData.title || !formData.description || !formData.category}
              className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-slate-900 font-semibold"
            >
              {createPostMutation.isPending ? "Criando..." : "Criar Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
