import DateTimePicker from '@react-native-community/datetimepicker';
import { useMutation, useQuery } from "convex/react";
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from "../../convex/_generated/api";

export default function TodoScreen() {
  const tarefas = useQuery(api.tarefas.listar);
  const adicionarTarefa = useMutation(api.tarefas.adicionar);
  const alternarStatus = useMutation(api.tarefas.alternarStatus);
  const removerTarefa = useMutation(api.tarefas.remover);

  const [novoAssunto, setNovoAssunto] = useState('');
  const [dataPrazo, setDataPrazo] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [prazoTexto, setPrazoTexto] = useState('');

  const onChangeData = (event: any, selectedDate?: Date) => {
    setMostrarPicker(false);
    if (selectedDate) {
      setDataPrazo(selectedDate);
      const dataFormatada = selectedDate.toLocaleDateString('pt-BR');
      setPrazoTexto(dataFormatada);
    }
  };

  const handleSalvarTarefa = async () => {
    const prazoParaSalvar = prazoTexto.trim().length === 0 ? "Sem prazo" : prazoTexto;

    if (!novoAssunto.trim()) {
      Alert.alert("Campo Vazio", "Digite o nome da tarefa.");
      return;
    }

    await adicionarTarefa({
      assunto: novoAssunto,
      prioridade: "Alta",
      prazo: prazoParaSalvar,
    });

    Alert.alert("Feito", "Tarefa adicionada com sucesso! 📝");

    setNovoAssunto('');
    setPrazoTexto('');
  };

  const handleAlternarStatus = async (id: any, statusAtual: boolean) => {
    await alternarStatus({ id, atual: statusAtual });
  
    
    if (!statusAtual) {
      Alert.alert("Parabéns!", "Tarefa concluída com sucesso! ✅");
    }
  };

  const handleExcluirTarefa = async (id: any) => {
    await removerTarefa({ id });
    
    Alert.alert("Feito", "Tarefa excluída com sucesso! 🗑️");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SwiftDo ✍️</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite o nome da tarefa"
          placeholderTextColor="#999"
          style={styles.input}
          value={novoAssunto}
          onChangeText={setNovoAssunto}
        />
        
        <TouchableOpacity 
          onPress={() => setMostrarPicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateButtonText}>
            {prazoTexto ? `🗓️ Prazo: ${prazoTexto}` : '🗓️ Adicionar a data (opcional)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvarTarefa}>
          <Text style={styles.saveButtonText}>Adicionar Tarefa</Text>
        </TouchableOpacity>
      </View>

      {mostrarPicker && (
        <DateTimePicker
          value={dataPrazo}
          mode="date"
          display="default"
          onChange={onChangeData}
          minimumDate={new Date()}
        />
      )}

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Tarefas:</Text>
        <Text style={styles.hintText}>💡 Dica: Toque na tarefa para marcar como concluída ou para desmarcar</Text>

        {tarefas === undefined ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : (
          tarefas.map((tarefa) => (
            <View key={tarefa._id} style={styles.cardWrapper}> 
              <TouchableOpacity 
                onPress={() => handleAlternarStatus(tarefa._id, tarefa.finalizada)}
                style={[styles.card, tarefa.finalizada && styles.cardFinished]} 
              >
                <View style={[
                  styles.priorityTag, 
                  { backgroundColor: tarefa.finalizada ? '#4CD964' : '#FF3B30' } 
                ]} />
                
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.cardText, tarefa.finalizada && styles.textFinished]}>
                    {tarefa.assunto}
                  </Text>
                  
                  {tarefa.prazo ? (
                    <Text style={{ fontSize: 12, color: '#8E8E93', marginTop: 4 }}>
                      📅 Prazo: {tarefa.prazo}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
          
              <TouchableOpacity 
                onPress={() => handleExcluirTarefa(tarefa._id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    fontWeight: '600',
  },
  hintText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'column',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    elevation: 2,
    color: '#333',
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 10,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 1,
  },
  cardFinished: {
    opacity: 0.5,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  textFinished: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  priorityTag: {
    width: 5,
    height: 20,
    marginRight: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    padding: 8,
    borderRadius: 8,
    marginLeft: 10,
    width: 40,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});