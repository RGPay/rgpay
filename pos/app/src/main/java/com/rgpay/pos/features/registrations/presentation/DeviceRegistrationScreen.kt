package com.rgpay.pos.features.registrations.presentation

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import kotlinx.coroutines.delay
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.rgpay.pos.R
import com.rgpay.pos.features.registrations.clients.DeviceApiClient
import com.rgpay.pos.features.registrations.clients.DeviceMetadata
import com.rgpay.pos.features.registrations.data.DeviceMetadataModel
import com.rgpay.pos.core.ui.theme.RgpayPrimary
import com.rgpay.pos.core.ui.theme.RgpaySecondary
import com.rgpay.pos.core.ui.theme.RgpaySuccess
import com.rgpay.pos.core.ui.theme.RgpayTheme
import com.rgpay.pos.viewmodel.RestaurantData
import kotlinx.coroutines.launch

@Composable
fun DeviceRegistrationScreen(
    navController: NavController,
    apiKey: String,
    deviceApiClient: DeviceApiClient = DeviceApiClient(),
    deviceModel: DeviceMetadataModel = viewModel(),
    onRestaurantDataLoaded: (RestaurantData) -> Unit = {}
) {
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(false) }
    var isLoadingData by remember { mutableStateOf(true) }
    var deviceError by remember { mutableStateOf<String?>(null) }
    var deviceData by remember { mutableStateOf<DeviceMetadata?>(null) }
    var isSuccess by remember { mutableStateOf(false) }

    // Carregar dados do dispositivo quando a tela abrir
    LaunchedEffect(apiKey) {
        try {
            deviceData = deviceApiClient.getDevice(apiKey)
            deviceModel.updateDeviceName(deviceData?.deviceName ?: "")
            deviceModel.updateLocationName(deviceData?.locationName ?: "")
            
            // Salvar dados do restaurante no AppViewModel
            val restaurantData = RestaurantData(
                id = deviceData?.locationId ?: "",
                name = deviceData?.locationName ?: "",
                restaurantName = "Lorem ipsum Lanches", // TODO: Buscar do backend
                address = "Rua das Flores, 123 - Centro", // TODO: Buscar do backend
                logoUrl = "" // TODO: Buscar do backend
            )
            onRestaurantDataLoaded(restaurantData)
        } catch (e: Exception) {
            deviceError = "Erro ao carregar dados do dispositivo"
        } finally {
            isLoadingData = false
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Card com logo (igual Welcome e ApiKey)
            Card(
                modifier = Modifier
                    .size(120.dp)
                    .clip(RoundedCornerShape(24.dp)),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surface
                ),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    RgpayPrimary,
                                    RgpaySecondary
                                )
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.icon),
                        contentDescription = stringResource(R.string.logo),
                        modifier = Modifier.size(64.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            Text(
                text = "Confirme os dados do dispositivo",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            if (isLoadingData) {
                // Mostrar loading enquanto carrega os dados
                Column(
                    modifier = Modifier.fillMaxWidth(0.9f),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    CircularProgressIndicator()
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Carregando dados do dispositivo...",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                // Mostrar campos quando dados carregaram
                OutlinedTextField(
                    value = deviceModel.deviceName,
                    onValueChange = { deviceModel.updateDeviceName(it) },
                    label = { Text("Nome do dispositivo") },
                    modifier = Modifier.fillMaxWidth(0.9f)
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = deviceModel.locationName,
                    onValueChange = { deviceModel.updateLocationName(it) },
                    label = { Text("Localização") },
                    modifier = Modifier.fillMaxWidth(0.9f),
                    enabled = false
                )
            }

            if (deviceError != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = deviceError ?: "",
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            if (isLoadingData) {
                // Botão desabilitado enquanto carrega dados
                Button(
                    modifier = Modifier.fillMaxWidth(0.8f),
                    enabled = false,
                    onClick = { }
                ) {
                    Text("Carregando...")
                }
            } else if (isLoading) {
                CircularProgressIndicator()
            } else if (isSuccess) {
                // Feedback de sucesso
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    CircularProgressIndicator(
                        color = RgpaySuccess
                    )
                    Text(
                        text = "Dispositivo registrado com sucesso!",
                        style = MaterialTheme.typography.bodyMedium,
                        color = RgpaySuccess,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "Redirecionando...",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                Button(
                    modifier = Modifier.fillMaxWidth(0.8f),
                    onClick = {
                        isLoading = true
                        scope.launch {
                            try {
                                deviceApiClient.assignDevice(apiKey)
                                // Mostrar sucesso e navegar para tela principal de tabs
                                isSuccess = true
                                delay(1500) // Mostrar feedback por 1.5 segundos
                                
                                // Navegar para tela principal de comandas após registro bem-sucedido
                                // Isso limpa o back stack até welcome_screen, impedindo voltar
                                navController.navigate("tabs_home") {
                                    popUpTo("welcome_screen") { inclusive = true }
                                }
                            } catch (e: Exception) {
                                deviceError = "Erro ao registrar dispositivo"
                            } finally {
                                isLoading = false
                            }
                        }
                    }
                ) {
                    Text("Confirmar")
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DeviceRegistrationScreenPreview() {
    RgpayTheme {
        DeviceRegistrationScreen(
            navController = rememberNavController(),
            apiKey = "fake_api_key"
        )
    }
}
