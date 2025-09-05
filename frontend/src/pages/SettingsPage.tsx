import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  People as PeopleIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Toast, ThemeSettings } from "../components";
import UsersService, {
  User,
  CreateUserDto,
  UpdateUserDto,
} from "../services/users.service";
import UnidadesService, { Unidade } from "../services/unidades.service";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

// Local form state allows temporary empty value for id_unidade to avoid MUI out-of-range warnings
type UserFormState = {
  nome: string;
  email: string;
  senha?: string;
  tipo_usuario: "master" | "gerente";
  id_unidade: number | "";
};

const SettingsPage: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<User[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<UserFormState>({
    nome: "",
    email: "",
    senha: "",
    tipo_usuario: "gerente",
    id_unidade: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const [usersData, unidadesData] = await Promise.all([
        UsersService.getUsers(),
        UnidadesService.getAll(),
      ]);
      setUsers(usersData);
      setUnidades(unidadesData);
    } catch {
      setToast({
        open: true,
        message: "Erro ao carregar usuários",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.tipo_usuario === "master" && activeTab === 1) {
      loadUsers();
    }
  }, [currentUser?.tipo_usuario, activeTab]);

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        nome: user.nome,
        email: user.email,
        senha: "",
        tipo_usuario: user.tipo_usuario,
        id_unidade: user.id_unidade,
      });
    } else {
      setEditingUser(null);
      setFormData({
        nome: "",
        email: "",
        senha: "",
        tipo_usuario: "gerente",
        id_unidade: unidades.length > 0 ? unidades[0].id_unidade : "",
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingUser(null);
    setFormData({
      nome: "",
      email: "",
      senha: "",
      tipo_usuario: "gerente",
      id_unidade: "",
    });
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        // Update user
        const updateData: UpdateUserDto = {
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          tipo_usuario: formData.tipo_usuario,
          id_unidade:
            formData.id_unidade === "" ? undefined : Number(formData.id_unidade),
        };
        if (!updateData.senha) {
          delete updateData.senha; // Don't update password if empty
        }
        await UsersService.updateUser(editingUser.id_usuario, updateData);
        setToast({
          open: true,
          message: "Usuário atualizado com sucesso",
          severity: "success",
        });
      } else {
        // Create user
        if (formData.id_unidade === "") {
          setToast({
            open: true,
            message: "Selecione uma unidade",
            severity: "error",
          });
          return;
        }
        await UsersService.createUser({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha || "",
          tipo_usuario: formData.tipo_usuario,
          id_unidade: Number(formData.id_unidade),
        });
        setToast({
          open: true,
          message: "Usuário criado com sucesso",
          severity: "success",
        });
      }
      handleCloseDialog();
      loadUsers();
    } catch {
      setToast({
        open: true,
        message: editingUser
          ? "Erro ao atualizar usuário"
          : "Erro ao criar usuário",
        severity: "error",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await UsersService.deleteUser(userToDelete.id_usuario);
        setToast({
          open: true,
          message: "Usuário excluído com sucesso",
          severity: "success",
        });
        setDeleteDialogOpen(false);
        setUserToDelete(null);
        loadUsers();
      } catch {
        setToast({
          open: true,
          message: "Erro ao excluir usuário",
          severity: "error",
        });
      }
    }
  };

  const getUnidadeNome = (id_unidade: number) => {
    const unidade = unidades.find((u) => u.id_unidade === id_unidade);
    return unidade ? unidade.nome : "N/A";
  };

  const getTipoUsuarioChip = (tipo: string) => {
    return (
      <Chip
        label={tipo === "master" ? "Master" : "Gerente"}
        color={tipo === "master" ? "primary" : "secondary"}
        size="small"
      />
    );
  };

  // Usuários só podem gerenciar "Usuários" se forem master. O restante (tema) é liberado.

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography>Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SettingsIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h5" component="h1">
            Configurações
          </Typography>
        </Box>
        {activeTab === 1 && currentUser?.tipo_usuario === "master" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Novo Usuário
          </Button>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab icon={<PaletteIcon />} label="Tema" iconPosition="start" />
          {currentUser?.tipo_usuario === "master" && (
            <Tab icon={<PeopleIcon />} label="Usuários" iconPosition="start" />
          )}
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && <ThemeSettings />}

      {activeTab === 1 && currentUser?.tipo_usuario === "master" && (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Unidade</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id_usuario}>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {getTipoUsuarioChip(user.tipo_usuario)}
                      </TableCell>
                      <TableCell>{getUnidadeNome(user.id_unidade)}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDialog(user)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setUserToDelete(user);
                            setDeleteDialogOpen(true);
                          }}
                          size="small"
                          disabled={user.id_usuario === currentUser?.sub}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* User Form Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? "Editar Usuário" : "Novo Usuário"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={
                  editingUser
                    ? "Nova Senha (deixe vazio para não alterar)"
                    : "Senha"
                }
                type="password"
                value={formData.senha}
                onChange={(e) =>
                  setFormData({ ...formData, senha: e.target.value })
                }
                required={!editingUser}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Tipo de Usuário"
                value={formData.tipo_usuario}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipo_usuario: e.target.value as "master" | "gerente",
                  })
                }
              >
                <MenuItem value="gerente">Gerente</MenuItem>
                <MenuItem value="master">Master</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Unidade"
                value={formData.id_unidade === "" ? "" : Number(formData.id_unidade)}
                onChange={(e) => {
                  const val = e.target.value as unknown as string;
                  setFormData({
                    ...formData,
                    id_unidade: val === "" ? "" : parseInt(val, 10),
                  });
                }}
              >
                <MenuItem value="">
                  <em>Selecione uma unidade</em>
                </MenuItem>
                {unidades.map((unidade) => (
                  <MenuItem key={unidade.id_unidade} value={unidade.id_unidade}>
                    {unidade.nome}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveUser}
            variant="contained"
            startIcon={<SaveIcon />}
          >
            {editingUser ? "Atualizar" : "Criar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir o usuário "{userToDelete?.nome}"?
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        onClose={handleCloseToast}
      />
    </Box>
  );
};

export default SettingsPage;
