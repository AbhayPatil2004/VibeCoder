"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const templates = [
  {
    id: "react",
    name: "React",
    description:
      "A JavaScript library for building user interfaces with component-based architecture",
    icon: "/react.svg",
    color: "#61DAFB",
    popularity: 5,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Component-Based", "Virtual DOM", "JSX Support"],
    category: "frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "The React framework for production with server-side rendering and static site generation",
    icon: "/nextjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["React", "SSR", "Fullstack"],
    features: ["Server Components", "API Routes", "File-based Routing"],
    category: "fullstack",
  },
  {
    id: "express",
    name: "Express",
    description:
      "Fast, unopinionated, minimalist web framework for Node.js",
    icon: "/expressjs-icon.svg",
    color: "#000000",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "HTTP Utilities"],
    category: "backend",
  },
  {
    id: "vue",
    name: "Vue.js",
    description:
      "Progressive JavaScript framework for building user interfaces",
    icon: "/vuejs-icon.svg",
    color: "#4FC08D",
    popularity: 4,
    tags: ["UI", "Frontend", "JavaScript"],
    features: ["Reactive Binding", "Components", "Virtual DOM"],
    category: "frontend",
  },
  {
    id: "hono",
    name: "Hono",
    description:
      "Fast, lightweight framework built on Web Standards",
    icon: "/hono.svg",
    color: "#e36002",
    popularity: 3,
    tags: ["Node.js", "TypeScript", "Backend"],
    features: ["DI", "TypeScript", "Modular"],
    category: "backend",
  },
  {
    id: "angular",
    name: "Angular",
    description:
      "Framework for building fast and reliable applications",
    icon: "/angular-2.svg",
    color: "#DD0031",
    popularity: 3,
    tags: ["Fullstack", "JavaScript"],
    features: ["DI", "TypeScript", "Components"],
    category: "fullstack",
  },
];

const TemplateSelectionModal = ({ isOpen, onClose, onSubmit }) => {
  const [step, setStep] = useState("select");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [projectName, setProjectName] = useState("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      category === "all" || template.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleCreateProject = () => {
    const templateMap = {
      react: "REACT",
      nextjs: "NEXTJS",
      express: "EXPRESS",
      vue: "VUE",
      hono: "HONO",
      angular: "ANGULAR",
    };

    const template = templates.find((t) => t.id === selectedTemplate);

    onSubmit({
      title: projectName || `New ${template?.name} Project`,
      template: templateMap[selectedTemplate] || "REACT",
      description: template?.description,
    });

    onClose();
    setStep("select");
    setSelectedTemplate(null);
    setProjectName("");
  };

  const renderStars = (count) =>
    Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }
        />
      ));

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-[#e93f3f]">
                <Plus size={20} /> Select a Template
              </DialogTitle>
              <DialogDescription>
                Choose a template to start your project
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <Tabs defaultValue="all" onValueChange={setCategory}>
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="frontend">Frontend</TabsTrigger>
                  <TabsTrigger value="backend">Backend</TabsTrigger>
                  <TabsTrigger value="fullstack">Fullstack</TabsTrigger>
                </TabsList>
              </Tabs>

              <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={setSelectedTemplate}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`border p-4 rounded-lg cursor-pointer ${
                        selectedTemplate === template.id
                          ? "border-[#E93F3F]"
                          : ""
                      }`}
                      onClick={() => setSelectedTemplate(template.id)}
                    >
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex">
                          {renderStars(template.popularity)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <RadioGroupItem
                        value={template.id}
                        className="sr-only"
                      />
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                disabled={!selectedTemplate}
                onClick={() => setStep("configure")}
                className="bg-[#E93F3F] text-white"
              >
                Continue <ChevronRight size={16} />
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-[#e93f3f]">
                Configure Project
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <Label>Project Name</Label>
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>

            <div className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={() => setStep("select")}>
                Back
              </Button>
              <Button
                className="bg-[#E93F3F] text-white"
                onClick={handleCreateProject}
              >
                Create Project
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
