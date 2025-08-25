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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.rgpay.pos.R
import com.rgpay.pos.features.registrations.clients.DeviceApiClient
import com.rgpay.pos.core.ui.theme.RgpayPrimary
import com.rgpay.pos.core.ui.theme.RgpaySecondary
import com.rgpay.pos.core.ui.theme.RgpayTheme
import kotlinx.coroutines.launch

@Composable
fun ApiKeyScreen(navController: NavController) {
    var apiKey by remember { mutableStateOf("") }
    var showError by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val deviceApiClient = remember { DeviceApiClient() }

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
            // Mantém o mesmo card do logo do Welcome
            Card(
                modifier = Modifier
                    .size(120.dp)
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                RgpayPrimary,
                                RgpaySecondary
                            )
                        ),
                        shape = RoundedCornerShape(24.dp)
                    ),
                shape = RoundedCornerShape(24.dp),
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
                text = "Digite sua chave de API",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = apiKey,
                onValueChange = {
                    apiKey = it
                    showError = false
                    errorMessage = ""
                },
                label = { Text("Chave de API*") },
                isError = showError,
                modifier = Modifier.fillMaxWidth(0.9f)
            )

            if (showError) {
                Text(
                    text = errorMessage.ifEmpty { "A chave não pode ser vazia" },
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            if (isLoading) {
                CircularProgressIndicator()
            } else {
                Button(
                    modifier = Modifier.fillMaxWidth(0.8f),
                    onClick = {
                        if (apiKey.isBlank()) {
                            showError = true
                            errorMessage = "A chave não pode ser vazia"
                        } else {
                            // Validar API key antes de navegar
                            isLoading = true
                            scope.launch {
                                try {
                                    deviceApiClient.getDevice(apiKey)
                                    // Se chegou aqui, a API key é válida
                                    navController.navigate("device_registration/$apiKey")
                                } catch (e: Exception) {
                                    showError = true
                                    errorMessage = when (e.message) {
                                        "Dispositivo não encontrado" -> "Chave de API inválida"
                                        else -> "Erro ao validar chave de API"
                                    }
                                } finally {
                                    isLoading = false
                                }
                            }
                        }
                    }
                ) {
                    Text("Próximo")
                }
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun ApiKeyScreenPreview() {
    RgpayTheme {
        ApiKeyScreen(navController = rememberNavController())
    }
}
