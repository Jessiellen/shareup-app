"use client"

import React, { useState, useRef } from "react"

// (removed, now included in the line above)
import { useAuth } from "@/contexts/auth-context"
import Navigation from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Save, X, Plus, Trash2, Camera, Upload } from "lucide-react"

interface ProfileStats {
  joined: string
  rates: string
  posts: string
  answered: string
}

interface Skill {
  id: string
  name: string
  level: number
  category: string
}

interface ProfileData {
  name: string
  profession: string
  bio: string
  avatar: string | null
  stats: ProfileStats
  skills: Skill[]
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showSkillModal, setShowSkillModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profileData, setProfileData] = useState<ProfileData>({
    name: "JOÃO PEDRO",
    profession: "Full Stack Developer",
    bio: "Desenvolvedor apaixonado por tecnologia e educação. Especializado em React, Node.js e Python. Sempre disposto a compartilhar conhecimento e aprender coisas novas.",
    avatar: null, // Inicialmente sem foto
    stats: {
      joined: "Jan 2024",
      rates: "4.8/5",
      posts: "23",
      answered: "156",
    },
    skills: [
      { id: "1", name: "JavaScript", level: 90, category: "Programming" },
      { id: "2", name: "React", level: 85, category: "Frontend" },
      { id: "3", name: "Node.js", level: 80, category: "Backend" },
      { id: "4", name: "Python", level: 75, category: "Programming" },
      { id: "5", name: "UI/UX Design", level: 70, category: "Design" },
    ],
  })

  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData)

  if (!user) {
    return <div>Loading...</div>
  }

  const handleSave = () => {
    setProfileData(tempProfileData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setTempProfileData(profileData)
    setIsEditing(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecione apenas arquivos de imagem.")
        return
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setTempProfileData((prev) => ({
          ...prev,
          avatar: imageUrl,
        }))
        setShowAvatarModal(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setTempProfileData((prev) => ({
      ...prev,
      avatar: null,
    }))
    setShowAvatarModal(false)
  }

  const addSkill = (skill: Omit<Skill, "id">) => {
    const newSkill = { ...skill, id: Date.now().toString() }
    setTempProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }))
  }

  const updateSkill = (skillId: string, updatedSkill: Omit<Skill, "id">) => {
    setTempProfileData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) => (skill.id === skillId ? { ...updatedSkill, id: skillId } : skill)),
    }))
  }

  const deleteSkill = (skillId: string) => {
    setTempProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== skillId),
    }))
  }

  const currentData = isEditing ? tempProfileData : profileData

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-shareup-dark text-white">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        {/* Edit Controls */}
        {isEditing && (
          <div className="flex justify-end space-x-3 mb-6">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-shareup-lime hover:bg-shareup-lime/90 text-shareup-dark font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    {/* Avatar ou Ícone */}
                    {currentData.avatar ? (
                      <img
                        src={currentData.avatar || "/placeholder.svg"}
                        alt={currentData.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-shareup-cyan"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-r from-shareup-cyan to-shareup-lime rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-shareup-dark">{getInitials(currentData.name)}</span>
                      </div>
                    )}

                    {/* Botão de editar foto */}
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAvatarModal(true)}
                        className="absolute bottom-3 right-0 w-8 h-8 bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-300 text-sm">Name</Label>
                        <Input
                          value={tempProfileData.name}
                          onChange={(e) => setTempProfileData((prev) => ({ ...prev, name: e.target.value }))}
                          className="text-center font-bold text-lg bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm">Profession</Label>
                        <Input
                          value={tempProfileData.profession}
                          onChange={(e) => setTempProfileData((prev) => ({ ...prev, profession: e.target.value }))}
                          className="text-center bg-gray-700 border-gray-600 text-gray-300"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-white">{currentData.name}</h2>
                      <p className="text-slate-400">{currentData.profession}</p>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Joined :</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-shareup-lime rounded-full"></div>
                      {isEditing ? (
                        <Input
                          value={tempProfileData.stats.joined}
                          onChange={(e) =>
                            setTempProfileData((prev) => ({
                              ...prev,
                              stats: { ...prev.stats, joined: e.target.value },
                            }))
                          }
                          className="w-20 h-8 text-xs bg-gray-700 border-gray-600 text-white"
                        />
                      ) : (
                        <span className="text-white font-medium">{currentData.stats.joined}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Rates :</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-shareup-lime rounded-full"></div>
                      {isEditing ? (
                        <Input
                          value={tempProfileData.stats.rates}
                          onChange={(e) =>
                            setTempProfileData((prev) => ({
                              ...prev,
                              stats: { ...prev.stats, rates: e.target.value },
                            }))
                          }
                          className="w-20 h-8 text-xs bg-gray-700 border-gray-600 text-white"
                        />
                      ) : (
                        <span className="text-white font-medium">{currentData.stats.rates}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Posts :</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-shareup-lime rounded-full"></div>
                      {isEditing ? (
                        <Input
                          value={tempProfileData.stats.posts}
                          onChange={(e) =>
                            setTempProfileData((prev) => ({
                              ...prev,
                              stats: { ...prev.stats, posts: e.target.value },
                            }))
                          }
                          className="w-20 h-8 text-xs bg-gray-700 border-gray-600 text-white"
                        />
                      ) : (
                        <span className="text-white font-medium">{currentData.stats.posts}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Answered :</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-shareup-lime rounded-full"></div>
                      {isEditing ? (
                        <Input
                          value={tempProfileData.stats.answered}
                          onChange={(e) =>
                            setTempProfileData((prev) => ({
                              ...prev,
                              stats: { ...prev.stats, answered: e.target.value },
                            }))
                          }
                          className="w-20 h-8 text-xs bg-gray-700 border-gray-600 text-white"
                        />
                      ) : (
                        <span className="text-white font-medium">{currentData.stats.answered}</span>
                      )}
                    </div>
                  </div>
                </div>

                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-6 bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Bio Section */}
            {isEditing && (
              <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700 mt-6">
                <CardContent className="p-6">
                  <Label className="text-shareup-cyan font-semibold mb-3 block">Bio</Label>
                  <Textarea
                    value={tempProfileData.bio}
                    onChange={(e) => setTempProfileData((prev) => ({ ...prev, bio: e.target.value }))}
                    className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                    placeholder="Tell us about yourself..."
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Skills and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Skills Section */}
            <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-shareup-cyan">My Skills</h3>
                  {isEditing && (
                    <Button
                      onClick={() => {
                        setEditingSkill(null)
                        setShowSkillModal(true)
                      }}
                      size="sm"
                      className="bg-shareup-lime hover:bg-shareup-lime/90 text-shareup-dark font-semibold"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Skill
                    </Button>
                  )}
                </div>
                <div className="space-y-4">
                  {currentData.skills.map((skill, index) => (
                    <div key={skill.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-white">{skill.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-400">{skill.level}%</span>
                          {isEditing && (
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingSkill(skill)
                                  setShowSkillModal(true)
                                }}
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteSkill(skill.id)}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-shareup-cyan to-shareup-lime h-2 rounded-full transition-all duration-500"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bio Display (when not editing) */}
            {!isEditing && (
              <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-shareup-cyan">About Me</h3>
                  <p className="text-slate-300 leading-relaxed">{currentData.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="bg-shareup-dark/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-6 text-shareup-cyan">Recent Activity</h3>
                <div className="space-y-4">
                  {[
                    { action: "Completed skill exchange", skill: "React Hooks", time: "2 hours ago" },
                    { action: "Posted new tutorial", skill: "Node.js API", time: "1 day ago" },
                    { action: "Received 5-star rating", skill: "JavaScript", time: "2 days ago" },
                    { action: "Started learning", skill: "Python ML", time: "3 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-slate-700/30 rounded-lg">
                      <div className="w-2 h-2 bg-shareup-cyan rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{activity.action}</p>
                        <p className="text-slate-400 text-sm">
                          {activity.skill} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Avatar Modal */}
      <Dialog open={showAvatarModal} onOpenChange={setShowAvatarModal}>
        <DialogContent className="bg-shareup-dark border-gray-600 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-shareup-cyan">Change Profile Photo</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Preview atual */}
            <div className="text-center">
              <div className="relative inline-block">
                {tempProfileData.avatar ? (
                  <img
                    src={tempProfileData.avatar || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-2 border-shareup-cyan mx-auto"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-r from-shareup-cyan to-shareup-lime rounded-full mx-auto flex items-center justify-center">
                    <span className="text-3xl font-bold text-shareup-dark">{getInitials(tempProfileData.name)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="space-y-3">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload New Photo
              </Button>

              {tempProfileData.avatar && (
                <Button
                  onClick={removeAvatar}
                  variant="outline"
                  className="w-full border-red-500 text-red-400 hover:bg-red-500/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Photo
                </Button>
              )}

              <Button
                onClick={() => setShowAvatarModal(false)}
                variant="outline"
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Done
              </Button>
            </div>

            {/* Informações sobre upload */}
            <div className="text-xs text-gray-400 text-center space-y-1">
              <p>Supported formats: JPG, PNG, GIF</p>
              <p>Maximum size: 5MB</p>
              <p>Recommended: Square images (1:1 ratio)</p>
            </div>
          </div>

          {/* Input file oculto */}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
        </DialogContent>
      </Dialog>

      {/* Skill Modal */}
      <SkillModal
        isOpen={showSkillModal}
        onClose={() => {
          setShowSkillModal(false)
          setEditingSkill(null)
        }}
        onSave={(skill) => {
          if (editingSkill) {
            updateSkill(editingSkill.id, skill)
          } else {
            addSkill(skill)
          }
          setShowSkillModal(false)
          setEditingSkill(null)
        }}
        skill={editingSkill}
      />
    </div>
  )
}

// Skill Modal Component
function SkillModal({
  isOpen,
  onClose,
  onSave,
  skill,
}: {
  isOpen: boolean
  onClose: () => void
  onSave: (skill: Omit<Skill, "id">) => void
  skill: Skill | null
}) {
  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    category: "Programming",
  })

  React.useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        level: skill.level,
        category: skill.category,
      })
    } else {
      setFormData({
        name: "",
        level: 50,
        category: "Programming",
      })
    }
  }, [skill])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const categories = ["Programming", "Frontend", "Backend", "Design", "Marketing", "Data Science", "DevOps"]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-shareup-dark border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-shareup-cyan">{skill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-gray-300">Skill Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., JavaScript, React, Python..."
              required
            />
          </div>

          <div>
            <Label className="text-gray-300">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-600">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Proficiency Level: {formData.level}%</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.level}
              onChange={(e) => setFormData((prev) => ({ ...prev, level: Number(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer mt-2"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-shareup-cyan hover:bg-shareup-cyan/90 text-shareup-dark font-semibold"
            >
              {skill ? "Update" : "Add"} Skill
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
