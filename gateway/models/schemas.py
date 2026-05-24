from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str = "USER"

class ComponentRequest(BaseModel):
    name: str
    category: str
    description: str
    documentation: str
    codeSnippet: str
    usageExample: str
    createdBy: str

class ComponentAccessRequest(BaseModel):
    name: str
    category: str = "General"
    description: str = ""
    documentation: str = ""
    requestedBy: str

class CategoryRequest(BaseModel):
    name: str
    description: str = ""